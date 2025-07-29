import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Stethoscope, Heart } from "lucide-react"
import Link from "next/link"

export default function ConfirmPage() {
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
          <div className="mx-auto mb-4 w-16 h-16 bg-medledger-teal/10 rounded-full flex items-center justify-center">
            <Mail className="h-10 w-10 text-medledger-teal" />
          </div>
          <CardTitle className="text-2xl text-medledger-navy">📧 Check Your Email</CardTitle>
          <CardDescription>We've sent you a special welcome message!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="bg-medledger-light/50 p-4 rounded-lg mb-4 border border-medledger-teal/20">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-medledger-navy font-medium mb-2">Welcome to the MedLedger NG Family!</p>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to your inbox. Click the link in the email to activate your account and
                start your journey with us.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>💡 Pro Tip:</strong> Check your spam/junk folder if you don't see the email in your inbox.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-4">Didn't receive the email? No worries, it happens!</p>

              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="w-full border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent mb-2"
                >
                  Resend Confirmation Email
                </Button>
              </Link>

              <Link href="/auth/login">
                <Button className="w-full bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
