/**
 * Combines multiple class names into a single string
 * @param {string[]} classes - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  
  /**
   * Formats a date to a readable string
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  export function formatDate(date) {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  /**
   * Truncates a string to a specified length
   * @param {string} str - String to truncate
   * @param {number} length - Maximum length
   * @returns {string} - Truncated string
   */
  export function truncateString(str, length = 50) {
    if (!str) return ""
    if (str.length <= length) return str
    return `${str.substring(0, length)}...`
  }
  
  