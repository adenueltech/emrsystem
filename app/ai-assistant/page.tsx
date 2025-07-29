import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AIAssistantContent } from "@/components/ai-assistant/ai-assistant-content"

export default async function AIAssistantPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch SOAP templates
  const { data: soapTemplates } = await supabase
    .from("soap_templates")
    .select("*")
    .order("category", { ascending: true })

  // Fetch medication templates
  const { data: medicationTemplates } = await supabase
    .from("medication_templates")
    .select("*")
    .order("medication_name", { ascending: true })

  return <AIAssistantContent soapTemplates={soapTemplates || []} medicationTemplates={medicationTemplates || []} />
}
