"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Stethoscope,
  Brain,
  Shield,
  Clock,
  Users,
  FileText,
  Mic,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  X,
} from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart SOAP Notes Helper",
      description: "AI suggests text based on previous visits, vitals, and diagnosis keywords",
      benefit: "Speeds up note writing",
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice-to-Text Dictation",
      description: "Web Speech API integration to convert doctor's speech into structured notes",
      benefit: "Saves time, supports local accents",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Auto Prescribing Suggestions",
      description: "Based on past prescriptions and symptoms, suggest dosage templates",
      benefit: "Reduces repetitive typing",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Vital Trend Analysis",
      description: "Charts and summaries of BP, glucose, etc. with AI-flagged abnormalities",
      benefit: "Supports decision-making",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Drug Interaction Warnings",
      description: "AI checks for known interactions in patient's current medications",
      benefit: "Boosts safety",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Lab Result Summarizer",
      description: "AI helps extract insights from uploaded PDFs or images of lab results",
      benefit: "Saves time, ensures completeness",
    },
  ]

  const benefits = [
    {
      category: "For Doctors",
      items: [
        "Reduces burnout from documentation",
        "Saves 5–10 minutes per patient",
        "Improves diagnostic thoroughness",
      ],
    },
    {
      category: "For Clinics",
      items: [
        "Enhances workflow without hiring more staff",
        "More patients served per day",
        "Professional, consistent prescriptions and records",
      ],
    },
    {
      category: "For Patients",
      items: [
        "Accurate, digital health records",
        "Timely follow-ups based on AI-generated reminders",
        "Safer care with AI-supported checks",
      ],
    },
  ]

  const faqs = [
    {
      question: "What is MedLedger NG and who is it for?",
      answer:
        "MedLedger NG is a lightweight, AI-powered Electronic Health Records (EHR) platform specifically designed for Nigerian healthcare providers. It's perfect for solo doctors, small clinics, and community health centers who need an efficient, affordable solution for managing patient records, appointments, and medical documentation.",
    },
    {
      question: "How does the AI assistance work?",
      answer:
        "Our AI features help streamline your workflow by generating SOAP notes based on patient symptoms, suggesting prescription instructions, analyzing symptoms for potential diagnoses, and providing medication templates. All AI suggestions are editable and the final medical decisions always rest with you as the healthcare provider.",
    },
    {
      question: "Is my patient data secure and private?",
      answer:
        "Absolutely. We take data security seriously with end-to-end encryption, NDPR compliance, and HIPAA-aligned practices. Your patient data never leaves the platform without your explicit consent, and all data is encrypted both in transit and at rest. We follow strict medical data privacy standards.",
    },
    {
      question: "Can I use MedLedger NG on my mobile phone?",
      answer:
        "Yes! MedLedger NG is fully mobile-responsive and works seamlessly on smartphones, tablets, and desktop computers. You can access patient records, schedule appointments, and document visits from any device with an internet connection.",
    },
    {
      question: "How much does MedLedger NG cost?",
      answer:
        "We offer flexible pricing plans designed for Nigerian healthcare providers. Start with our free trial to explore all features. Our paid plans are affordable and scale with your practice size. Contact us for detailed pricing information tailored to your needs.",
    },
    {
      question: "Do I need technical expertise to use the platform?",
      answer:
        "Not at all! MedLedger NG is designed to be user-friendly and intuitive. If you can use a smartphone or basic computer applications, you can use our platform. We also provide comprehensive onboarding support and training materials.",
    },
    {
      question: "Can I import my existing patient records?",
      answer:
        "Yes, we provide data import tools to help you migrate your existing patient records into MedLedger NG. Our support team can assist you with the migration process to ensure a smooth transition from your current system.",
    },
    {
      question: "What happens if I lose internet connection?",
      answer:
        "While MedLedger NG is primarily cloud-based for security and accessibility, we're working on offline capabilities for basic functions. Currently, you'll need an internet connection to access the platform, but your data is always safely stored in the cloud.",
    },
    {
      question: "Is there customer support available?",
      answer:
        "Yes! We provide comprehensive customer support including email support, help documentation, video tutorials, and onboarding assistance. Our support team understands the Nigerian healthcare context and can help you get the most out of the platform.",
    },
    {
      question: "Can multiple doctors use the same account?",
      answer:
        "Currently, each doctor needs their own individual account to maintain proper data separation and security. However, we're developing multi-provider clinic features for larger practices. Contact us to discuss your specific needs.",
    },
    {
      question: "How often is the platform updated?",
      answer:
        "We regularly update MedLedger NG with new features, security improvements, and bug fixes. Updates are automatically applied to your account, and we'll notify you of major new features. Your feedback helps us prioritize which features to develop next.",
    },
    {
      question: "What if I want to stop using MedLedger NG?",
      answer:
        "You can export all your data at any time and cancel your subscription without any penalties. We believe in giving you full control over your data, and we'll help ensure a smooth transition if you decide to move to another system.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-medledger-light via-white to-medledger-light/50">
      {/* Header */}
      <header className="border-b border-medledger-teal/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-medledger-teal flex-shrink-0" />
              <span className="text-lg sm:text-2xl font-bold text-medledger-navy truncate">MedLedger NG</span>
            </div>

            {/* Navigation - Responsive layout */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-medledger-navy hover:text-medledger-teal text-sm sm:text-base px-2 sm:px-4"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-medledger-teal hover:bg-medledger-teal/90 text-white text-sm sm:text-base px-3 sm:px-4"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-medledger-teal/10 text-medledger-teal border-medledger-teal/20">
            AI-Powered Healthcare for Nigeria
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-medledger-navy mb-6">
            Electronic Health Records
            <span className="block text-medledger-teal">Built for Nigerian Healthcare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A lightweight, secure, and mobile-responsive EHR platform designed for solo doctors, small clinics, and
            community health centers. Combining simplicity with AI-powered intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Why AI Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4">🎯 Why AI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Doctors in small clinics often have limited time for documentation, no access to clinical assistants, and
              pressure to reduce errors and improve care. We use lightweight, privacy-focused AI tools to assist, not
              replace, medical professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-medledger-teal/20">
              <CardHeader>
                <Clock className="h-12 w-12 text-medledger-teal mb-4" />
                <CardTitle className="text-medledger-navy">Limited Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Busy schedules leave little time for comprehensive documentation</p>
              </CardContent>
            </Card>

            <Card className="border-medledger-teal/20">
              <CardHeader>
                <Users className="h-12 w-12 text-medledger-teal mb-4" />
                <CardTitle className="text-medledger-navy">No Clinical Assistants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Small clinics can't afford dedicated support staff for record keeping</p>
              </CardContent>
            </Card>

            <Card className="border-medledger-teal/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-medledger-teal mb-4" />
                <CardTitle className="text-medledger-navy">Reduce Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Pressure to improve care quality while maintaining efficiency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 px-4 bg-medledger-light/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4">⚙️ AI-Driven Features</h2>
            <p className="text-lg text-gray-600">
              Intelligent tools designed specifically for Nigerian healthcare workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-medledger-teal/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-medledger-teal/10 rounded-lg text-medledger-teal">{feature.icon}</div>
                    <CardTitle className="text-medledger-navy text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{feature.description}</CardDescription>
                  <Badge variant="secondary" className="bg-medledger-teal/10 text-medledger-teal">
                    {feature.benefit}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4">📈 How It Helps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy text-xl">{benefit.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-medledger-teal mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4">💰 Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your practice. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="border-2 border-gray-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gray-100 text-gray-700 px-4 py-1">🧪 STARTER</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-medledger-navy mb-2">Free Tier</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-medledger-navy">₦0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-sm">
                  Perfect for small solo doctors trying out the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 10 patient profiles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1 user (Doctor only)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic visit notes (manual entry)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">PDF prescriptions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Limited templates</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-500">No SMS reminders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-500">No analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-500">No AI suggestions</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white">Start Free Trial</Button>

                <p className="text-xs text-center text-gray-500 mt-2">
                  Perfect for testing the system before upgrading
                </p>
              </CardContent>
            </Card>

            {/* Basic Tier */}
            <Card className="border-2 border-medledger-teal relative shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-medledger-teal text-white px-4 py-1">🚀 MOST POPULAR</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-medledger-navy mb-2">Clinic Plan</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-medledger-teal">₦15,000</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-sm">For small clinics and serious solo consultants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">Up to 500 patients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">3 users (Doctor, Receptionist, Nurse)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">Smart SOAP note suggestions (AI)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">Prescription generator (PDF with logo)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">SMS reminders (100/month)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">Appointment calendar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-medledger-teal" />
                    <span className="text-sm">Basic dashboard (visits, revenue)</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-medledger-teal hover:bg-medledger-teal/90 text-white">
                  Start 7-Day Free Trial
                </Button>

                <p className="text-xs text-center text-gray-500 mt-2">Feel the difference with AI-powered features</p>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-2 border-purple-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-4 py-1">💼 PREMIUM</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-medledger-navy mb-2">Premium Plan</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-purple-600">₦30,000</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-sm">For busy clinics and growing practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-purple-800 font-medium">Everything in Clinic Plan +</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Unlimited patients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Offline mode (PWA)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Full analytics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Billing & payment tracking (NHIS-style)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Custom service pricing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Staff role management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                  Start 7-Day Free Trial
                </Button>

                <p className="text-xs text-center text-gray-500 mt-2">Unlock full clinical and business value</p>
              </CardContent>
            </Card>
          </div>

          {/* Add-on Pricing */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-medledger-navy mb-4">💸 Optional Add-ons</h3>
              <p className="text-gray-600">Enhance your plan with additional features as needed</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    Extra SMS Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-medledger-teal">₦500</span>
                    <span className="text-gray-600">per 100 SMS</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Need more than your plan's SMS limit? Add extra messages as needed for appointment reminders and
                    follow-ups.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-medledger-teal/20">
                <CardHeader>
                  <CardTitle className="text-medledger-navy flex items-center">
                    <span className="text-2xl mr-2">🎨</span>
                    Custom Branding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-medledger-teal">₦20,000</span>
                    <span className="text-gray-600">one-time setup</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    White-label the platform with your clinic's logo, colors, and branding for a professional,
                    personalized experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-12 text-center">
            <div className="bg-medledger-light/30 p-6 rounded-lg max-w-2xl mx-auto">
              <h4 className="font-semibold text-medledger-navy mb-3">💡 Pricing Notes</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• All plans include free setup and onboarding support</p>
                <p>• No hidden fees or long-term contracts</p>
                <p>• Cancel anytime with full data export</p>
                <p>• Prices are in Nigerian Naira (₦)</p>
                <p>• 7-day free trial available for Clinic and Premium plans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-medledger-light/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 mr-3" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about MedLedger NG and how it can transform your medical practice.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-medledger-teal/20 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left text-medledger-navy hover:text-medledger-teal font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12">
              <Card className="border-medledger-teal/20 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-medledger-navy mb-2">Still have questions?</h3>
                  <p className="text-gray-600 mb-4">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="border-medledger-teal text-medledger-teal hover:bg-medledger-teal/10 bg-transparent"
                    >
                      Contact Support
                    </Button>
                    <Button className="bg-medledger-teal hover:bg-medledger-teal/90 text-white">Schedule a Demo</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Ethics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medledger-navy mb-4">🔐 Privacy & Ethics</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-medledger-teal/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-medledger-teal mb-4" />
                <CardTitle className="text-medledger-navy">Data Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• No AI data leaves the platform without doctor's consent</li>
                  <li>• NDPR compliant with HIPAA-aligned practices</li>
                  <li>• All data encrypted in transit and at rest</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-medledger-teal/20">
              <CardHeader>
                <Brain className="h-12 w-12 text-medledger-teal mb-4" />
                <CardTitle className="text-medledger-navy">AI Ethics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• All AI suggestions are editable</li>
                  <li>• Final decisions always rest with the doctor</li>
                  <li>• Optimized for low-resource settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-medledger-teal text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Nigerian healthcare providers who are already saving time and improving patient care with MedLedger NG.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-medledger-teal hover:bg-gray-100">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-medledger-navy text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="h-6 w-6" />
                <span className="text-xl font-bold">MedLedger NG</span>
              </div>
              <p className="text-gray-300">
                Built specifically for Nigerian healthcare workflows, local languages, and real-life constraints.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 MedLedger NG. All rights reserved. Built for Nigerian Healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
