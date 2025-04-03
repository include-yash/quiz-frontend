"use client"
import Select from "../../components/ui/select"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { List, Award, Search, Calendar, Clock, Users, Filter, Play } from "react-feather"
import { fetchData } from "../../utils/api"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import { useToast } from "../../components/ui/toast"

function ViewTests() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [unreleasedTests, setUnreleasedTests] = useState([])
  const [releasedTests, setReleasedTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token-teach")

    if (!token) {
      setError("No token found. Please log in again.")
      setLoading(false)
      return
    }

    fetchData("/teacher/displayquiz", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setUnreleasedTests(response.unreleased_quizzes || [])
        setReleasedTests(response.released_quizzes || [])
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
        addToast("Failed to load tests", { type: "error" })
      })
  }, [addToast])

  const handleReleaseTest = async (quizId) => {
    try {
      const token = localStorage.getItem("token-teach")
      const response = await fetchData("/teacher/release-quiz", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_id: quizId }),
      })

      if (response.message === "Quiz released successfully") {
        addToast("Quiz released successfully!", { type: "success" })
        const releasedQuiz = unreleasedTests.find((test) => test.id === quizId)
        setUnreleasedTests(unreleasedTests.filter((test) => test.id !== quizId))
        setReleasedTests([...releasedTests, { ...releasedQuiz, id: response.quiz_id }])
      } else {
        addToast(`Failed to release quiz: ${response.error}`, { type: "error" })
      }
    } catch (error) {
      console.error("Error releasing quiz:", error)
      addToast("Error releasing quiz", { type: "error" })
    }
  }

  const filteredUnreleasedTests = unreleasedTests.filter((test) => {
    const matchesSearch = test.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment ? test.department === filterDepartment : true
    return matchesSearch && matchesDepartment
  })

  const filteredReleasedTests = releasedTests.filter((test) => {
    const matchesSearch = test.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment ? test.department === filterDepartment : true
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set([...unreleasedTests, ...releasedTests].map((test) => test.department))].filter(Boolean)

  return (
    <TeacherLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-quiz-purple-400">View Tests</h1>
          <Button onClick={() => navigate("/teacher/create-test")} className="flex items-center gap-2">
            <Calendar size={18} className="mr-1" /> Create New Test
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="!mt-2">
          <CardContent className="p-4 !py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter size={18} className="text-gray-500" />
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full md:w-[180px]"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-quiz-dark-50 rounded w-1/3 mb-4"></div>
                  <div className="flex flex-wrap gap-3">
                    <div className="h-4 bg-quiz-dark-50 rounded w-24"></div>
                    <div className="h-4 bg-quiz-dark-50 rounded w-32"></div>
                    <div className="h-4 bg-quiz-dark-50 rounded w-40"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => navigate("/teacher/login")} className="mt-4">
                  Return to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Unreleased Tests */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Unreleased Tests</h2>
              {filteredUnreleasedTests.length > 0 ? (
                filteredUnreleasedTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:border-quiz-purple-600/40 transition-colors">
                      <CardContent className="p-6 !py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-quiz-purple-400">{test.quiz_name}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center text-gray-400">
                                <Calendar size={14} className="mr-2" />
                                <span>Batch: {test.batch_year}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <List size={14} className="mr-2" />
                                <span>Dept: {test.department}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Clock size={14} className="mr-2" />
                                <span>Created: {new Date(test.created_at || Date.now()).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                            <Button
                              onClick={() => handleReleaseTest(test.id)}
                              className="flex items-center gap-2"
                            >
                              <Play size={16} /> Release Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-400">No unreleased tests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Released Tests */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Released Tests</h2>
              {filteredReleasedTests.length > 0 ? (
                filteredReleasedTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:border-quiz-purple-600/40 transition-colors">
                      <CardContent className="p-6 !py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-quiz-purple-400">{test.quiz_name}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center text-gray-400">
                                <Calendar size={14} className="mr-2" />
                                <span>Batch: {test.batch_year}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <List size={14} className="mr-2" />
                                <span>Dept: {test.department}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Clock size={14} className="mr-2" />
                                <span>Created: {new Date(test.created_at || Date.now()).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Users size={14} className="mr-2" />
                                <span>Students: {test.student_count || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                            <Button
                              onClick={() => navigate(`/teacher/leaderboard/${test.id}`)}
                              className="flex items-center gap-2"
                            >
                              <Award size={16} /> Leaderboard
                            </Button>
                            <Button
                              onClick={() => navigate(`/teacher/tab-switch/${test.id}`)}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              <List size={16} /> Tab Switch
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-400">No released tests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}

export default ViewTests