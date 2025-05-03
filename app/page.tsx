"use client"

import { useState, useEffect } from "react"
import Dashboard from "@/components/dashboard"
import LoginPage from "@/components/login-page"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { logout } from "@/state/slices/authSlice"
import { useDispatch } from "react-redux"

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true)

  // Initialize loading state
  useEffect(() => {
    // Small delay to prevent flash of loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard user={user} onLogout={() => dispatch(logout())} /> : <LoginPage />
}

