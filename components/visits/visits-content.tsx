"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Plus, Search, Activity, Calendar, Users, Eye, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { format, isToday, isThisWeek } from "date-fns"
import type { Visit } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface VisitsContentProps {
  visits: Visit[]
}

export function VisitsContent({ visits }: VisitsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVisits = visits.filter(
    (visit) =>
      visit.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.patient?.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.chief_complaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.diagnosis?.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getVisitTypeBadge = (type: string) => {
    switch (type) {
      case "consultation":
        return <Badge className="bg-blue-100 text-blue-800">Consultation</Badge>
      case "follow-up":
        return <Badge className="bg-green-100 text-green-800">Follow-up</Badge>
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>
      case "routine":
        return <Badge className="bg-purple-100 text-purple-800">Routine</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getDateLabel = (date: string) => {
    const visitDate = new Date(date)
    if (isToday(visitDate)) return "Today"
    if (isThisWeek(visitDate)) return format(visitDate, "EEEE")
    return format(visitDate, "MMM dd, yyyy")
  }

  const todayVisits = visits.filter((visit) => isToday(new Date(visit.visit_date)))
  const thisWeekVisits = visits.filter((visit) => isThisWeek(new Date(visit.visit_date)))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medledger-navy">Patient Visits</h1>
            <p className="text-gray-600">Manage patient consultations and medical records</p>
          </div>
          <Link href="/visits/new">
            <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Visit
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Total Visits</CardTitle>
              <Activity className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{visits.length}</div>
              <p className="text-xs text-gray-600">All time visits</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Today's Visits</CardTitle>
              <Calendar className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{todayVisits.length}</div>
              <p className="text-xs text-gray-600">Visits today</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">This Week</CardTitle>
              <Users className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{thisWeekVisits.length}</div>
              <p className="text-xs text-gray-600">Visits this week</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Follow-ups Due</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {visits.filter((v) => v.follow_up_date && new Date(v.follow_up_date) <= new Date()).length}
              </div>
              <p className="text-xs text-gray-600">Pending follow-ups</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">Visit Records</CardTitle>
            <CardDescription>Search and manage patient visit records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search visits by patient name, ID, complaint, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-medledger-teal/20 focus:border-medledger-teal"
                />
              </div>
            </div>

            {/* Visits List */}
            <div className="space-y-4">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-medledger-teal/10 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-medledger-teal" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-medledger-navy">
                            {visit.patient?.first_name} {visit.patient?.last_name}
                          </h3>
                          {getVisitTypeBadge(visit.visit_type)}
                        </div>
                        <p className="text-sm text-gray-600">ID: {visit.patient?.patient_id}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {getDateLabel(visit.visit_date)} • {format(new Date(visit.visit_date), "h:mm a")}
                            </span>
                          </div>
                          {visit.chief_complaint && (
                            <span className="text-xs text-gray-600">• {visit.chief_complaint}</span>
                          )}
                        </div>
                        {visit.diagnosis && visit.diagnosis.length > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-gray-500">Diagnosis:</span>
                            <span className="text-xs text-medledger-navy font-medium">
                              {visit.diagnosis.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {visit.follow_up_date && new Date(visit.follow_up_date) <= new Date() && (
                        <Badge variant="destructive" className="text-xs">
                          Follow-up Due
                        </Badge>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/visits/${visit.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/visits/${visit.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Visit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/visits/new?patient=${visit.patient_id}&follow_up=${visit.id}`}>
                              <Plus className="h-4 w-4 mr-2" />
                              Schedule Follow-up
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No visits found" : "No visits recorded"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start by recording your first patient visit"}
                  </p>
                  {!searchTerm && (
                    <Link href="/visits/new">
                      <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Record First Visit
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
