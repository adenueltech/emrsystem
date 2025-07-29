import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Stethoscope, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medledger-light via-white to-medledger-light/50 p-4">
      <Card className="w-full max-w-md border-medledger-teal/20 shadow-lg">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <Stethoscope className="h-8 w-8 text-medledger-teal" />
            <span className="text-2xl font-bold text-medledger-navy">MedLedger NG</span>
          </Link>
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-medledger-navy mb-2">🎉 Email Verified Successfully!</CardTitle>
          <CardDescription className="text-base">Your account has been confirmed and is now active</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-green-50 p-6 rounded-lg mb-6 border border-green-200">
              <p className="text-green-800 font-semibold mb-3 text-lg">Welcome to MedLedger NG! 🏥</p>
              <p className="text-sm text-green-700 leading-relaxed">
                Your email has been successfully verified and your account is now fully activated. You can now access
                all features of our Electronic Health Records platform.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">✨ What's Next?</p>
              <ul className="text-xs text-blue-700 space-y-1 text-left">
                <li>• Set up your practice profile</li>
                <li>• Add your first patient</li>
                <li>• Explore AI-powered features</li>
                <li>• Schedule appointments</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white py-3 text-base font-medium">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
                >
                  Back to Login
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-600">
                🔒 <strong>Secure & Private:</strong> Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
