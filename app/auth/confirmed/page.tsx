import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medledger-light via-white to-medledger-light/50 p-4">
      <Card className="w-full max-w-md border-medledger-teal/20">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <Stethoscope className="h-8 w-8 text-medledger-teal" />
            <span className="text-2xl font-bold text-medledger-navy">MedLedger NG</span>
          </Link>
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-medledger-navy">🎉 Email Confirmed!</CardTitle>
          <CardDescription>Your account has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
              <p className="text-green-800 font-medium mb-2">Welcome to MedLedger NG!</p>
              <p className="text-sm text-green-700">
                Your email has been verified and your account is now active. You can start managing your patients and
                practice right away.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                  Go to Dashboard
                </Button>
              </Link>

              <div className="text-xs text-gray-500">
                <p>🚀 Ready to transform your practice?</p>
                <p>Start by adding your first patient or exploring our AI-powered features.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
