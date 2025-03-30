"use client"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "react-feather"

const BackButton = ({ to, label = "Back", className = "" }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button onClick={handleClick} className={`back-button ${className}`}>
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  )
}

export default BackButton

