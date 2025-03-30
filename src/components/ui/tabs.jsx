"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

const Tabs = ({ children, defaultValue, value, onValueChange, className }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue || "")

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined && value !== selectedTab) {
      setSelectedTab(value)
    }
  }, [value])

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue)
    onValueChange?.(newValue)
  }

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    if (child.type.displayName === "TabsList") {
      return React.cloneElement(child, {
        selectedTab,
        onSelect: handleTabChange,
      })
    }

    if (child.type.displayName === "TabsContent") {
      return React.cloneElement(child, {
        selectedTab,
        value: child.props.value,
      })
    }

    return child
  })

  return <div className={cn("w-full", className)}>{enhancedChildren}</div>
}

const TabsList = ({ children, selectedTab, onSelect, className }) => {
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    if (child.type.displayName === "TabsTrigger") {
      return React.cloneElement(child, {
        isSelected: selectedTab === child.props.value,
        onSelect: () => onSelect(child.props.value),
      })
    }

    return child
  })

  return (
    <div className={cn("flex p-1 bg-quiz-dark-200 rounded-lg mb-4", className)}>
      {enhancedChildren}
    </div>
  )
}

const TabsTrigger = ({ children, value, isSelected, onSelect, className }) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={onSelect}
      className={cn(
        "relative flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
        isSelected ? "text-white" : "text-gray-400 hover:text-white",
        className
      )}
    >
      {children}
      {isSelected && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-quiz-purple-600 rounded-md -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  )
}

const TabsContent = ({ children, value, selectedTab, className }) => {
  const isActive = selectedTab === value

  return (
    <div role="tabpanel" className={cn("mt-2", className)}>
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Tabs.displayName = "Tabs"
TabsList.displayName = "TabsList"
TabsTrigger.displayName = "TabsTrigger"
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }