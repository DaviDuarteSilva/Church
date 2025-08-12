import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  // Verificar se o usuário já está logado
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário está logado, redirecionar para dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
