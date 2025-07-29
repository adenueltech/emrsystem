"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stethoscope, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    clinicName: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            clinic_name: formData.clinicName,
            phone: formData.phone,
            license_number: formData.licenseNumber,
            specialization: formData.specialization,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: "🎉 Welcome to MedLedger NG!",
            description: "Please check your email to verify your account and get started.",
          })
          router.push("/auth/confirm")
        } else {
          // User is automatically signed in (email confirmation disabled)
          toast({
            title: "🎉 Welcome to MedLedger NG!",
            description: "Your account has been created successfully!",
          })
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const specializations = [
    "General Practice",
    "Internal Medicine",
    "Pediatrics",
    "Obstetrics & Gynecology",
    "Surgery",
    "Cardiology",
    "Dermatology",
    "Psychiatry",
    "Orthopedics",
    "Ophthalmology",
    "ENT",
    "Radiology",
    "Pathology",
    "Anesthesiology",
    "Emergency Medicine",
    "Family Medicine",
    "Other",
  ]

  return (
    <Card className="w-full max-w-2xl border-medledger-teal/20">
      <CardHeader className="text-center">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
          <Stethoscope className="h-8 w-8 text-medledger-teal" />
          <span className="text-2xl font-bold text-medledger-navy">MedLedger NG</span>
        </Link>
        <CardTitle className="text-2xl text-medledger-navy">Create Your Account</CardTitle>
        <CardDescription>Join thousands of Nigerian healthcare providers using MedLedger NG</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Dr. John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                className="border-medledger-teal/20 focus:border-medledger-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="border-medledger-teal/20 focus:border-medledger-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="border-medledger-teal/20 focus:border-medledger-teal pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="border-medledger-teal/20 focus:border-medledger-teal pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
              <Input
                id="clinicName"
                placeholder="ABC Medical Center"
                value={formData.clinicName}
                onChange={(e) => handleInputChange("clinicName", e.target.value)}
                className="border-medledger-teal/20 focus:border-medledger-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border-medledger-teal/20 focus:border-medledger-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Medical License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="MDCN/xxxx/xxxx"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                className="border-medledger-teal/20 focus:border-medledger-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select onValueChange={(value) => handleInputChange("specialization", value)}>
                <SelectTrigger className="border-medledger-teal/20 focus:border-medledger-teal">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-medledger-teal hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-medledger-teal hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-medledger-teal hover:underline">
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
