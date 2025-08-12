import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import PastorDashboard from "@/components/pastor-dashboard"
import SupervisorDashboard from "@/components/supervisor-dashboard"
import MembroDashboard from "@/components/membro-dashboard"

export default async function DashboardPage() {
  // Se o Supabase não estiver configurado, mostrar mensagem de configuração
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <h1 className="text-2xl font-bold mb-4 text-white">Conecte o Supabase para começar</h1>
      </div>
    )
  }

  // Verificar se o usuário está logado
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se não há usuário, redirecionar para login
  if (!user) {
    redirect("/auth/login")
  }

  // Buscar dados do usuário na tabela users
  const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error || !userData) {
    console.error("Erro ao buscar dados do usuário:", error)
    redirect("/auth/login")
  }

  // Renderizar dashboard baseado na função do usuário
  switch (userData.role) {
    case "admin":
      return <AdminDashboard user={userData} />
    case "pastor_presidente":
    case "pastor":
      return <PastorDashboard user={userData} />
    case "supervisor":
    case "lider_celula":
      return <SupervisorDashboard user={userData} />
    case "auxiliar":
    case "membro":
      return <MembroDashboard user={userData} />
    default:
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Função não reconhecida</h1>
            <p className="text-gray-600">Entre em contato com o administrador.</p>
          </div>
        </div>
      )
  }
}
