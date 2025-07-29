import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Shield } from "lucide-react"

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medledger-teal/5 to-medledger-navy/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-medledger-navy">Email Verified Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-gray-600">
              Welcome to MedLedger NG! Your email has been successfully verified and your account is now active.
            </p>
            <p className="text-sm text-gray-500">
              You can now access all features of our Electronic Health Records platform.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <Shield className="h-4 w-4" />
            <span>Your data is secure and protected</span>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-medledger-teal hover:bg-medledger-teal/90">
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">Need help? Contact our support team for assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
