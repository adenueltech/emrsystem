"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FileText, TrendingUp, Clock, Activity, Stethoscope } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { format } from "date-fns"

interface DashboardContentProps {
  profile: any
  stats: {
    totalPatients: number
    todayAppointments: number
    recentVisits: any[]
  }
}

export function DashboardContent({ profile, stats }: DashboardContentProps) {
  const quickActions = [
    {
      title: "New Patient",
      description: "Register a new patient",
      icon: <Users className="h-5 w-5" />,
      href: "/patients/new",
      color: "bg-blue-500",
    },
    {
      title: "New Visit",
      description: "Start a patient visit",
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/visits/new",
      color: "bg-green-500",
    },
    {
      title: "Schedule Appointment",
      description: "Book an appointment",
      icon: <Calendar className="h-5 w-5" />,
      href: "/appointments/new",
      color: "bg-purple-500",
    },
    {
      title: "View Reports",
      description: "Generate reports",
      icon: <FileText className="h-5 w-5" />,
      href: "/reports",
      color: "bg-orange-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-medledger-teal to-medledger-teal/80 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || "Doctor"}!</h1>
          <p className="opacity-90">
            {profile?.clinic_name && `${profile.clinic_name} • `}
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{stats.totalPatients}</div>
              <p className="text-xs text-gray-600">Active patient records</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{stats.todayAppointments}</div>
              <p className="text-xs text-gray-600">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Recent Visits</CardTitle>
              <Activity className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{stats.recentVisits.length}</div>
              <p className="text-xs text-gray-600">In the last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">AI Assists</CardTitle>
              <TrendingUp className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">24</div>
              <p className="text-xs text-gray-600">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-medledger-teal/20 hover:border-medledger-teal/40">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>{action.icon}</div>
                        <div>
                          <h3 className="font-semibold text-medledger-navy text-sm">{action.title}</h3>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="text-medledger-navy">Recent Visits</CardTitle>
              <CardDescription>Latest patient consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentVisits.length > 0 ? (
                  stats.recentVisits.map((visit: any) => (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between p-3 bg-medledger-light/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-medledger-navy">
                          {visit.patient?.first_name} {visit.patient?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {visit.patient?.patient_id} • {visit.chief_complaint || "General consultation"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{format(new Date(visit.visit_date), "MMM dd")}</p>
                        <Badge variant="secondary" className="text-xs">
                          {visit.visit_type}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent visits</p>
                    <p className="text-sm">Start by creating a new patient visit</p>
                  </div>
                )}
              </div>
              {stats.recentVisits.length > 0 && (
                <div className="mt-4">
                  <Link href="/visits">
                    <Button
                      variant="outline"
                      className="w-full border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
                    >
                      View All Visits
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="text-medledger-navy">AI Insights</CardTitle>
              <CardDescription>Smart suggestions for your practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Patient Flow Optimization</p>
                      <p className="text-sm text-blue-700">
                        Consider scheduling 15-minute buffer times between appointments to reduce wait times.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Follow-up Reminders</p>
                      <p className="text-sm text-green-700">3 patients are due for follow-up visits this week.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900">Documentation Tip</p>
                      <p className="text-sm text-orange-700">
                        Use voice-to-text for faster SOAP note entry during consultations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
