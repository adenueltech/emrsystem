"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BarChart3, Download, Users, Activity, TrendingUp, PieChart, FileText } from "lucide-react"
import { format, subDays, isWithinInterval } from "date-fns"
import type { Patient, Visit, Appointment } from "@/lib/types"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportsContentProps {
  patients: Patient[]
  visits: Visit[]
  appointments: Appointment[]
}

export function ReportsContent({ patients, visits, appointments }: ReportsContentProps) {
  const [timeRange, setTimeRange] = useState("30")

  const getDateRange = (days: number) => {
    const end = new Date()
    const start = subDays(end, days)
    return { start, end }
  }

  const filterByTimeRange = (items: any[], dateField: string) => {
    const { start, end } = getDateRange(Number.parseInt(timeRange))
    return items.filter((item) => isWithinInterval(new Date(item[dateField]), { start, end }))
  }

  const recentVisits = filterByTimeRange(visits, "visit_date")
  const recentAppointments = filterByTimeRange(appointments, "appointment_date")
  const recentPatients = filterByTimeRange(patients, "created_at")

  // Calculate statistics
  const totalRevenue = recentVisits.length * 5000 // Assuming average consultation fee
  const completedAppointments = recentAppointments.filter((apt) => apt.status === "completed").length
  const appointmentCompletionRate =
    recentAppointments.length > 0 ? Math.round((completedAppointments / recentAppointments.length) * 100) : 0

  // Gender distribution
  const malePatients = patients.filter((p) => p.gender === "male").length
  const femalePatients = patients.filter((p) => p.gender === "female").length

  // Common diagnoses
  const diagnosisCount: { [key: string]: number } = {}
  visits.forEach((visit) => {
    visit.diagnosis?.forEach((diagnosis) => {
      diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1
    })
  })
  const topDiagnoses = Object.entries(diagnosisCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Visit types
  const visitTypeCount: { [key: string]: number } = {}
  visits.forEach((visit) => {
    visitTypeCount[visit.visit_type] = (visitTypeCount[visit.visit_type] || 0) + 1
  })

  const exportReport = (type: string) => {
    // Simple CSV export functionality
    let csvContent = ""
    let filename = ""

    switch (type) {
      case "patients":
        csvContent = "data:text/csv;charset=utf-8,"
        csvContent += "Patient ID,Name,Gender,Age,Phone,Email,Date Registered\n"
        patients.forEach((patient) => {
          const age = patient.date_of_birth
            ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
            : "N/A"
          csvContent += `${patient.patient_id},"${patient.first_name} ${patient.last_name}",${patient.gender || "N/A"},${age},${patient.phone || "N/A"},${patient.email || "N/A"},${format(new Date(patient.created_at), "yyyy-MM-dd")}\n`
        })
        filename = `patients_report_${format(new Date(), "yyyy-MM-dd")}.csv`
        break

      case "visits":
        csvContent = "data:text/csv;charset=utf-8,"
        csvContent += "Visit Date,Patient,Visit Type,Chief Complaint,Diagnosis\n"
        recentVisits.forEach((visit) => {
          const patient = patients.find((p) => p.id === visit.patient_id)
          csvContent += `${format(new Date(visit.visit_date), "yyyy-MM-dd HH:mm")},"${patient?.first_name} ${patient?.last_name}",${visit.visit_type},"${visit.chief_complaint || "N/A"}","${visit.diagnosis?.join("; ") || "N/A"}"\n`
        })
        filename = `visits_report_${format(new Date(), "yyyy-MM-dd")}.csv`
        break

      case "appointments":
        csvContent = "data:text/csv;charset=utf-8,"
        csvContent += "Appointment Date,Patient,Status,Reason,Duration\n"
        recentAppointments.forEach((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patient_id)
          csvContent += `${format(new Date(appointment.appointment_date), "yyyy-MM-dd HH:mm")},"${patient?.first_name} ${patient?.last_name}",${appointment.status},"${appointment.reason || "N/A"}",${appointment.duration} min\n`
        })
        filename = `appointments_report_${format(new Date(), "yyyy-MM-dd")}.csv`
        break
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medledger-navy">Reports & Analytics</h1>
            <p className="text-gray-600">Insights and analytics for your medical practice</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 border-medledger-teal/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{patients.length}</div>
              <p className="text-xs text-gray-600">
                +{recentPatients.length} in last {timeRange} days
              </p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Total Visits</CardTitle>
              <Activity className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{recentVisits.length}</div>
              <p className="text-xs text-gray-600">In last {timeRange} days</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{appointmentCompletionRate}%</div>
              <p className="text-xs text-gray-600">Appointment completion rate</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">₦{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Estimated revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Demographics */}
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="text-medledger-navy flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Patient Demographics
              </CardTitle>
              <CardDescription>Gender distribution of your patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">Male</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{malePatients}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({patients.length > 0 ? Math.round((malePatients / patients.length) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-pink-500 rounded"></div>
                    <span className="text-sm">Female</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{femalePatients}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({patients.length > 0 ? Math.round((femalePatients / patients.length) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <span className="text-sm">Other/Unspecified</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{patients.length - malePatients - femalePatients}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {patients.length > 0
                        ? Math.round(((patients.length - malePatients - femalePatients) / patients.length) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Types */}
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="text-medledger-navy flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Visit Types
              </CardTitle>
              <CardDescription>Distribution of visit types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(visitTypeCount).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-medledger-teal rounded"></div>
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{count}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({visits.length > 0 ? Math.round((count / visits.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Diagnoses */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">Most Common Diagnoses</CardTitle>
            <CardDescription>Top 5 diagnoses in your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDiagnoses.length > 0 ? (
                topDiagnoses.map(([diagnosis, count], index) => (
                  <div
                    key={diagnosis}
                    className="flex items-center justify-between p-3 bg-medledger-light/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-medledger-teal/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-medledger-teal">{index + 1}</span>
                      </div>
                      <span className="font-medium text-medledger-navy">{diagnosis}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-medledger-navy">{count}</span>
                      <span className="text-xs text-gray-500 ml-1">cases</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No diagnosis data available</p>
                  <p className="text-sm">Start recording visits with diagnoses to see insights</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Reports */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">Export Reports</CardTitle>
            <CardDescription>Download detailed reports for your records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => exportReport("patients")}
                variant="outline"
                className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Patients
              </Button>
              <Button
                onClick={() => exportReport("visits")}
                variant="outline"
                className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Visits
              </Button>
              <Button
                onClick={() => exportReport("appointments")}
                variant="outline"
                className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Appointments
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Reports are exported as CSV files and include data from the selected time range.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
