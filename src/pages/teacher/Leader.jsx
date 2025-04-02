"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Award, User, Download, ArrowUp, ArrowDown, Search } from "react-feather"
import { fetchData } from "../../utils/api"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import { useToast } from "../../components/ui/toast"

const Leader = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const { addToast, clearToasts } = useToast()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" })
  const [errorShown, setErrorShown] = useState(false)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setErrorShown(false)
        const response = await fetchData(`/student/leaderboard/${testId}`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })

        console.log("Raw Response:", response)

        if (response && response.leaderboard) {
          // Ensure USN is included in each entry
          const formattedData = response.leaderboard.map(entry => ({
            ...entry,
            usn: entry.usn || 'N/A' // Default to 'N/A' if USN is missing
          }))
          setLeaderboardData(formattedData)
        } else {
          console.error("Failed to fetch leaderboard: Invalid response format", response)
          if (!errorShown) {
            clearToasts()
            addToast("Unable to fetch leaderboard data", { type: "error" })
            setErrorShown(true)
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        if (!errorShown) {
          clearToasts()
          addToast("Error loading leaderboard", { type: "error" })
          setErrorShown(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [testId, addToast, clearToasts, errorShown])

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    const sortableData = [...leaderboardData]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }

  const filteredData = getSortedData().filter((entry) =>
    entry.student_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToCSV = () => {
    // Sort the data by USN
    const sortedData = [...filteredData].sort((a, b) => {
        const usnA = a.usn || 'ZZZ'; // Default to 'ZZZ' if USN is missing to push to end
        const usnB = b.usn || 'ZZZ';
        return usnA.localeCompare(usnB);
    });

    // Update headers and data to include USN
    const headers = ["Rank", "Student Name", "USN", "Score", "Submission Time"];
    const csvData = sortedData.map((entry) => [
        entry.rank,
        entry.student_name,
        entry.usn || 'N/A',
        entry.score,
        new Date(entry.submission_time).toLocaleString(),
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leaderboard-${testId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Leaderboard exported to CSV", { type: "success" });
};

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return null
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-quiz-purple-400">Leaderboard</h1>
            <p className="text-gray-400 mt-1">Test ID: {testId}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/teacher/view-tests")}>
              Back to Tests
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2" disabled={leaderboardData.length === 0}>
              <Download size={16} /> Export CSV
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="p-0">
              <div className="animate-pulse">
                <div className="h-12 bg-quiz-dark-50 w-full"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-quiz-dark-100 w-full border-t border-quiz-dark-50"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {leaderboardData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
        <thead>
          <tr className="bg-quiz-dark-50 text-left">
            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("rank")}>
              <div className="flex items-center">
                Rank
                <SortIcon column="rank" />
              </div>
            </th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("student_name")}>
              <div className="flex items-center">
                Student Name
                <SortIcon column="student_name" />
              </div>
            </th>
            {/* Add USN column header */}
            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("usn")}>
              <div className="flex items-center">
                USN
                <SortIcon column="usn" />
              </div>
            </th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("score")}>
              <div className="flex items-center">
                Score
                <SortIcon column="score" />
              </div>
            </th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("submission_time")}>
              <div className="flex items-center">
                Submission Time
                <SortIcon column="submission_time" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="border-b border-quiz-dark-50 hover:bg-quiz-dark-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      entry.rank === 1
                        ? "bg-yellow-500 text-black"
                        : entry.rank === 2
                          ? "bg-gray-300 text-black"
                          : entry.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-quiz-dark-50 text-white"
                    }`}
                  >
                    {entry.rank}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-quiz-purple-300" />
                  {entry.student_name}
                </div>
              </td>
              {/* Add USN column data */}
              <td className="px-6 py-4 font-mono text-sm text-gray-300">
                {entry.usn || 'N/A'}
              </td>
              <td className="px-6 py-4 font-medium">{entry.score}</td>
              <td className="px-6 py-4 text-gray-400">
                {new Date(entry.submission_time).toLocaleString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award size={48} className="mx-auto text-quiz-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Leaderboard Data</h3>
                  <p className="text-gray-400">No students have completed this test yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherLayout>
  )
}

export default Leader