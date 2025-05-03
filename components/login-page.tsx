"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { login, clearError } from "@/state/slices/authSlice"
import { RootState, AppDispatch } from "@/state/store"

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleRememberChange = useCallback((checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      remember: checked
    }));
  }, []);

  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({
      email: formData.email,
      password: formData.password
    }));
  }, [formData, dispatch]);

  const formDescription = useMemo(() =>
    error || "Enter your email and password to access your dashboard",
    [error]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Jira Insights</span>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className={`text-center ${error ? 'text-red-500' : 'text-muted-foreground'}`}>
              {formDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={handleRememberChange}
                  disabled={loading}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


