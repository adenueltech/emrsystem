import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Stethoscope, ArrowRight, Shield } from "lucide-react"

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

          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 text-green-500 animate-ping opacity-20">
                <CheckCircle className="h-16 w-16" />
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl text-medledger-navy">Email Verified Successfully!</CardTitle>
          <CardDescription className="text-base">
            Welcome to MedLedger NG! Your account has been verified and is ready to use.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-medledger-light/20 p-4 rounded-lg">
            <h3 className="font-semibold text-medledger-navy mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Sign in to access your dashboard</li>
              <li>• Add your first patient</li>
              <li>• Schedule appointments</li>
              <li>• Start recording visits</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your data is secure and protected with us</span>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-medledger-teal hover:bg-medledger-teal/90">
              <Link href="/auth/login" className="flex items-center justify-center gap-2">
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <Link href="/contact" className="text-medledger-teal hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
