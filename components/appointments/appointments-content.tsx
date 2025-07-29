"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Plus, Calendar, Clock, Users, Phone, CheckCircle, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format, isToday, isTomorrow, isPast, isThisWeek } from "date-fns"
import type { Appointment } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AppointmentsContentProps {
  appointments: Appointment[]
}

export function AppointmentsContent({ appointments }: AppointmentsContentProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const getStatusBadge = (status: string, appointmentDate: string) => {
    const date = new Date(appointmentDate)

    if (isPast(date) && status === "scheduled") {
      return <Badge variant="destructive">Missed</Badge>
    }

    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-orange-100 text-orange-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDateLabel = (date: string) => {
    const appointmentDate = new Date(date)
    if (isToday(appointmentDate)) return "Today"
    if (isTomorrow(appointmentDate)) return "Tomorrow"
    if (isThisWeek(appointmentDate)) return format(appointmentDate, "EEEE")
    return format(appointmentDate, "MMM dd, yyyy")
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setIsUpdating(appointmentId)
    try {
      const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", appointmentId)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Appointment marked as ${newStatus}`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const todayAppointments = appointments.filter((apt) => isToday(new Date(apt.appointment_date)))
  const upcomingAppointments = appointments.filter(
    (apt) => !isToday(new Date(apt.appointment_date)) && !isPast(new Date(apt.appointment_date)),
  )
  const pastAppointments = appointments.filter(
    (apt) => isPast(new Date(apt.appointment_date)) && !isToday(new Date(apt.appointment_date)),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-medledger-navy">Appointments</h1>
            <p className="text-gray-600">Manage your appointment schedule</p>
          </div>
          <Link href="/appointments/new">
            <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{todayAppointments.length}</div>
              <p className="text-xs text-gray-600">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-medledger-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">{upcomingAppointments.length}</div>
              <p className="text-xs text-gray-600">Future appointments</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {appointments.filter((apt) => apt.status === "completed").length}
              </div>
              <p className="text-xs text-gray-600">Completed appointments</p>
            </CardContent>
          </Card>

          <Card className="border-medledger-teal/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-medledger-navy">No Shows</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medledger-navy">
                {appointments.filter((apt) => apt.status === "no-show").length}
              </div>
              <p className="text-xs text-gray-600">Missed appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        {todayAppointments.length > 0 && (
          <Card className="border-medledger-teal/20">
            <CardHeader>
              <CardTitle className="text-medledger-navy">Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-medledger-teal/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-medledger-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-medledger-navy">
                          {appointment.patient?.first_name} {appointment.patient?.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {appointment.patient?.patient_id}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {format(new Date(appointment.appointment_date), "h:mm a")}
                            </span>
                          </div>
                          {appointment.patient?.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{appointment.patient.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status, appointment.appointment_date)}
                      {appointment.status === "scheduled" && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            disabled={isUpdating === appointment.id}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "no-show")}
                            disabled={isUpdating === appointment.id}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <X className="h-3 w-3 mr-1" />
                            No Show
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Appointments */}
        <Card className="border-medledger-teal/20">
          <CardHeader>
            <CardTitle className="text-medledger-navy">All Appointments</CardTitle>
            <CardDescription>Complete appointment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-medledger-teal/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-medledger-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-medledger-navy">
                          {appointment.patient?.first_name} {appointment.patient?.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {appointment.patient?.patient_id}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{getDateLabel(appointment.appointment_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {format(new Date(appointment.appointment_date), "h:mm a")}
                            </span>
                          </div>
                          {appointment.reason && <span className="text-xs text-gray-600">• {appointment.reason}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status, appointment.appointment_date)}
                      {appointment.status === "scheduled" && !isPast(new Date(appointment.appointment_date)) && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            disabled={isUpdating === appointment.id}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            disabled={isUpdating === appointment.id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
                  <p className="text-gray-600 mb-4">Start by scheduling your first appointment</p>
                  <Link href="/appointments/new">
                    <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule First Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
