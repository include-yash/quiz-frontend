"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertTriangle, User, Clock, Search, Download } from "react-feather"
import { fetchData } from "../../utils/api"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import { formatDate } from "../../lib/utils"
import { useToast } from "../../components/ui/toast"

const TabSwitch = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [tabSwitchEvents, setTabSwitchEvents] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTabSwitchEvents = async () => {
      try {
        setLoading(true)
        const data = await fetchData(`/teacher/tab-switch/${quizId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-teach")}`,
          },
        })

         console.log("Raw Response:", data)

        if (data && data.tab_switch_events) {
          // Ensure USN is included in each event
          const formattedEvents = data.tab_switch_events.map(event => ({
            ...event,
            usn: event.usn || 'N/A' // Default to 'N/A' if USN is missing
          }))
          setTabSwitchEvents(formattedEvents)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        setError(err.message)
        addToast("Failed to load tab switch events", { type: "error" })
      } finally {
        setLoading(false)
      }
    }

    fetchTabSwitchEvents()
  }, [quizId, addToast])

  const filteredEvents = tabSwitchEvents.filter((event) =>
    event.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.usn && event.usn.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const exportToCSV = () => {
    // Update headers and data to include USN
    const headers = ["Student ID", "Student Name", "USN", "Timestamp"]
    const csvData = filteredEvents.map((event) => [
      event.id,
      event.student_name,
      event.usn || 'N/A',
      new Date(event.timestamp).toLocaleString(),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tab-switch-events-${quizId}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast("Tab switch events exported to CSV", { type: "success" })
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-quiz-purple-400">Tab Switch Events</h1>
            <p className="text-gray-400 mt-1">Quiz ID: {quizId}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/teacher/view-tests")}>
              Back to Tests
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2" disabled={tabSwitchEvents.length === 0}>
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
                placeholder="Search students or USN..."
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
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => navigate("/teacher/view-tests")}>Return to Tests</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {filteredEvents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-quiz-dark-50 text-left">
                        <th className="px-6 py-3">Student ID</th>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">USN</th>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((event, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="border-b border-quiz-dark-50 hover:bg-quiz-dark-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-sm">{event.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-quiz-purple-300" />
                              {event.student_name}
                            </div>
                          </td>
                          {/* Add USN column */}
                          <td className="px-6 py-4 font-mono text-sm text-gray-300">
                            {event.usn || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-quiz-purple-300" />
                              {formatDate(event.timestamp)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                              <AlertTriangle size={12} className="mr-1" /> Tab Switch Detected
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle size={48} className="mx-auto text-quiz-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Tab Switch Events</h3>
                  <p className="text-gray-400">No tab switch events have been detected for this quiz.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherLayout>
  )
}

export default TabSwitch
