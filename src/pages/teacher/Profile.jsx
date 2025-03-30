"use client"

import { useState, useContext, useEffect } from "react"
import { User, Mail, Book, Calendar, Edit, Save, X } from "react-feather"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import Select from "../../components/ui/select"
import { TeacherAuthContext } from "../../context/TeacherAuthContext"
import { useToast } from "../../components/ui/toast"

const Profile = () => {
  const { user } = useContext(TeacherAuthContext)
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    joinDate: "",
    bio: "",
    phone: "",
  })

  useEffect(() => {
    // Simulate loading teacher data
    setTimeout(() => {
      if (user && user.teacher_details) {
        setProfile({
          name: user.teacher_details.name || "John Doe",
          email: user.teacher_details.email || "john.doe@example.com",
          department: user.teacher_details.department || "Computer Science",
          joinDate: "January 2023",
          bio: "Experienced educator with a passion for interactive learning and assessment.",
          phone: "+1 (555) 123-4567",
        })
      }
      setLoading(false)
    }, 1000)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Simulate saving profile
    setEditing(false)
    addToast("Profile updated successfully", { type: "success" })
  }

  const handleCancel = () => {
    // Reset form and exit edit mode
    if (user && user.teacher_details) {
      setProfile({
        name: user.teacher_details.name || "John Doe",
        email: user.teacher_details.email || "john.doe@example.com",
        department: user.teacher_details.department || "Computer Science",
        joinDate: "January 2023",
        bio: "Experienced educator with a passion for interactive learning and assessment.",
        phone: "+1 (555) 123-4567",
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-quiz-purple-400">Profile</h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 bg-quiz-dark-50 rounded-full mx-auto md:mx-0"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-quiz-dark-50 rounded w-1/3"></div>
                    <div className="h-4 bg-quiz-dark-50 rounded w-1/4"></div>
                    <div className="h-4 bg-quiz-dark-50 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-20 bg-quiz-dark-50 rounded"></div>
                  <div className="h-20 bg-quiz-dark-50 rounded"></div>
                  <div className="h-20 bg-quiz-dark-50 rounded"></div>
                  <div className="h-20 bg-quiz-dark-50 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-quiz-purple-400">Profile</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
              <Edit size={16} /> Edit Profile
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-quiz-dark-50 rounded-full flex items-center justify-center overflow-hidden border-4 border-quiz-purple-600">
                  <User size={64} className="text-quiz-purple-400" />
                </div>
                {editing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                    onClick={() => addToast("Profile picture upload not implemented in this demo", { type: "info" })}
                  >
                    <Edit size={14} />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                {editing ? (
                  <Input name="name" value={profile.name} onChange={handleChange} className="text-2xl font-bold mb-2" />
                ) : (
                  <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
                )}

                <div className="flex items-center text-gray-400 mb-2">
                  <Mail size={16} className="mr-2 text-quiz-purple-400" />
                  {editing ? (
                    <Input name="email" value={profile.email} onChange={handleChange} className="text-sm" />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>

                <div className="flex items-center text-gray-400">
                  <Book size={16} className="mr-2 text-quiz-purple-400" />
                  {editing ? (
                    <Select name="department" value={profile.department} onChange={handleChange} className="text-sm">
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Systems">Information Systems</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </Select>
                  ) : (
                    <span>{profile.department}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-quiz-purple-400 mb-2">Bio</h3>
                {editing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full h-32 rounded-md border border-quiz-purple-900/20 bg-quiz-dark-100 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-quiz-purple-500"
                  />
                ) : (
                  <p className="text-gray-400">{profile.bio}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-quiz-purple-400 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Mail size={16} className="mr-2 text-quiz-purple-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar size={16} className="mr-2 text-quiz-purple-400" />
                    <span>Joined: {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    {editing ? (
                      <div className="flex items-center w-full">
                        <User size={16} className="mr-2 text-quiz-purple-400" />
                        <Input name="phone" value={profile.phone} onChange={handleChange} className="text-sm" />
                      </div>
                    ) : (
                      <>
                        <User size={16} className="mr-2 text-quiz-purple-400" />
                        <span>{profile.phone}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X size={16} /> Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        
      </div>
    </TeacherLayout>
  )
}

export default Profile

