"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { fetchData } from "../../utils/api"
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  Medal,
  Search,
  Trophy,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-800/50 rounded ${className}`}></div>

const Leaderboard = () => {
  const { testId } = useParams()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "ascending" })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchData(`/student/leaderboard/${testId}`, {
          method: "GET",
        })

        setLeaderboardData(data.leaderboard)
      } catch (error) {
        console.error("Error:", error)
        alert("Unable to fetch leaderboard. Please try again.")
      } finally {
        // Simulate loading for better UX
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    fetchLeaderboard()
  }, [testId])

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted and filtered data
  const getSortedData = () => {
    const filteredData = leaderboardData.filter((entry) =>
      entry.student_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Get paginated data
  const getPaginatedData = () => {
    const sortedData = getSortedData()
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-400"
    if (rank === 2) return "text-gray-300"
    if (rank === 3) return "text-amber-600"
    return "text-purple-400"
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-12 w-full mb-6" />

          <Skeleton className="h-12 w-full mb-2" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Trophy className="mr-3 h-7 w-7 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-gray-400 mt-1">Test ID: {testId}</p>
            </div>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Search and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">
                    <span className="font-bold text-white">{leaderboardData.length}</span> Participants
                  </span>
                </div>

                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    <span className="font-bold text-white">
                      {leaderboardData.length > 0 ? leaderboardData[0].score : 0}
                    </span>{" "}
                    Top Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {leaderboardData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("rank")}>
                          <div className="flex items-center">
                            <span>Rank</span>
                            {sortConfig.key === "rank" &&
                              (sortConfig.direction === "ascending" ? (
                                <ArrowUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("student_name")}>
                          <div className="flex items-center">
                            <span>Student Name</span>
                            {sortConfig.key === "student_name" &&
                              (sortConfig.direction === "ascending" ? (
                                <ArrowUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("score")}>
                          <div className="flex items-center">
                            <span>Score</span>
                            {sortConfig.key === "score" &&
                              (sortConfig.direction === "ascending" ? (
                                <ArrowUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left cursor-pointer"
                          onClick={() => requestSort("submission_time")}
                        >
                          <div className="flex items-center">
                            <span>Submission Time</span>
                            {sortConfig.key === "submission_time" &&
                              (sortConfig.direction === "ascending" ? (
                                <ArrowUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowDown className="h-4 w-4 ml-1" />
                              ))}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedData().map((entry, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                            entry.rank <= 3 ? "bg-gray-800/20" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {entry.rank <= 3 ? (
                                <Medal className={`h-5 w-5 mr-2 ${getMedalColor(entry.rank)}`} />
                              ) : (
                                <span className="w-5 h-5 inline-flex items-center justify-center mr-2 rounded-full bg-gray-800 text-xs">
                                  {entry.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">{entry.student_name}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-purple-400">{entry.score}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              {new Date(entry.submission_time).toLocaleString()}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {getSortedData().length > itemsPerPage && (
                  <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {Math.min((currentPage - 1) * itemsPerPage + 1, getSortedData().length)} to{" "}
                      {Math.min(currentPage * itemsPerPage, getSortedData().length)} of {getSortedData().length} entries
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {[...Array(Math.ceil(getSortedData().length / itemsPerPage))].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
                            currentPage === i + 1
                              ? "bg-purple-700 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(getSortedData().length / itemsPerPage)))
                        }
                        disabled={currentPage === Math.ceil(getSortedData().length / itemsPerPage)}
                        className={`p-2 rounded-md ${
                          currentPage === Math.ceil(getSortedData().length / itemsPerPage)
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-700" />
                <p className="text-xl text-gray-400 mb-2">No data available</p>
                <p className="text-gray-600">The leaderboard for this test is empty</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard

