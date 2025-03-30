import BackButton from "./BackButton"

const PageContainer = ({ children, title, backTo, backLabel, showBack = true, className = "" }) => {
  return (
    <div className={`min-h-screen quiz-gradient-bg text-white p-4 sm:p-6 ${className}`}>
      <div className="quiz-container">
        {showBack && (
          <div className="mb-6">
            <BackButton to={backTo} label={backLabel} />
          </div>
        )}

        {title && (
          <h1 className="text-3xl font-bold text-center mb-6" style={{ color: "var(--color-purple-400)" }}>
            {title}
          </h1>
        )}

        {children}
      </div>
    </div>
  )
}

export default PageContainer

