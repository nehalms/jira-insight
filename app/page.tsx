"use client"

import { useState, useEffect } from "react"
import Dashboard from "@/components/dashboard"
import LoginPage from "@/components/login-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleLogin = (email, password, remember) => {
    // In a real app, this would validate credentials against a backend
    // For demo purposes, we'll accept any non-empty email/password
    if (email && password) {
      setUser({ email, name: email.split("@")[0] })
      setIsAuthenticated(true)

      // Store authentication state in localStorage if remember is checked
      if (remember && typeof window !== "undefined") {
        try {
          localStorage.setItem("jiraInsightsAuth", JSON.stringify({ isAuthenticated: true, email }))
        } catch (e) {
          console.error("Failed to save auth state", e)
        }
      }

      return { success: true }
    }

    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("jiraInsightsAuth")
      } catch (e) {
        console.error("Failed to remove auth state", e)
      }
    }
  }

  // Check for stored authentication on component mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("jiraInsightsAuth")
      if (storedAuth) {
        try {
          const { isAuthenticated, email } = JSON.parse(storedAuth)
          if (isAuthenticated && email) {
            setUser({ email, name: email.split("@")[0] })
            setIsAuthenticated(true)
          }
        } catch (e) {
          localStorage.removeItem("jiraInsightsAuth")
        }
      }
    } catch (e) {
      console.error("Error accessing localStorage", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load saved theme preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme")
      const root = window.document.documentElement

      if (savedTheme) {
        root.classList.remove("light", "dark")
        root.classList.add(savedTheme === "dark" ? "dark" : "light")
      } else {
        // If no saved preference, check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
      }
    } catch (e) {
      console.error("Error setting initial theme", e)
    }
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}

