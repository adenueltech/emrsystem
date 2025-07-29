"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Plus, Search, Users, Phone, Mail, Calendar, Eye, Edit, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Patient } from "@/lib/types"

interface PatientsContentProps {
  patients: Patient[]
}

export function PatientsContent({ patients }: PatientsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getGenderBadgeColor = (gender?: string) => {
    switch (gender) {
      case "male":
        return "bg-blue-100 text-blue-800"
      case "female":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age} years`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medledger-navy">Patients</h1>
            <p className="text-gray-600">Manage your patient records and information</p>
          </div>
          <Link href="/patients/new">
            <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{patients.length}</div>
              <p className="text-xs text-gray-600">Active patient records</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {
                  patients.filter((p) => {
                    const createdDate = new Date(p.created_at)
                    const now = new Date()
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
              <p className="text-xs text-gray-600">Registered this month</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Male Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {patients.filter((p) => p.gender === "male").length}
              </div>
              <p className="text-xs text-gray-600">Male patients</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Female Patients</CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {patients.filter((p) => p.gender === "female").length}
              </div>
              <p className="text-xs text-gray-600">Female patients</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">Patient Directory</CardTitle>
            <CardDescription>Search and manage your patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients by name, ID, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-medledger-teal/20 focus:border-medledger-teal"
                />
              </div>
            </div>

            {/* Patients List */}
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-medledger-teal/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-medledger-teal" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-medledger-navy">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <Badge className={`text-xs ${getGenderBadgeColor(patient.gender)}`}>
                            {patient.gender || "N/A"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          {patient.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{patient.phone}</span>
                            </div>
                          )}
                          {patient.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{patient.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-medledger-navy">
                          Age: {calculateAge(patient.date_of_birth)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Registered: {format(new Date(patient.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Patient
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/visits/new?patient=${patient.id}`}>
                              <Plus className="h-4 w-4 mr-2" />
                              New Visit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No patients found" : "No patients yet"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start by adding your first patient to begin managing their health records"}
                  </p>
                  {!searchTerm && (
                    <Link href="/patients/new">
                      <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Patient
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
