"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Church, Users, LogOut, UserCheck } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { signOut } from "@/lib/actions"

interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: string
  created_at: string
}

export default function SupervisorDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState({
    celulasSupervisionadas: 0,
    membrosTotal: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar células supervisionadas ou lideradas
      const { data: celulasData } = await supabase
        .from("celulas")
        .select("*")
        .or(`supervisor_id.eq.${user.id},lider_id.eq.${user.id}`)

      setStats({
        celulasSupervisionadas: celulasData?.length || 0,
        membrosTotal: 0, // Calcular baseado nos membros das células
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.role === "supervisor" ? "Dashboard de Supervisão" : "Dashboard de Liderança"}
                </h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.full_name}</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  {user.role === "supervisor" ? "Supervisor" : "Líder de Célula"}
                </Badge>
              </div>
            </div>
            <form action={signOut}>
              <Button variant="outline" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === "supervisor" ? "Células Supervisionadas" : "Células Lideradas"}
              </CardTitle>
              <Church className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.celulasSupervisionadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.membrosTotal}</div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Responsabilidades</CardTitle>
            <CardDescription>
              {user.role === "supervisor"
                ? "Acompanhe e apoie os líderes de célula sob sua supervisão"
                : "Gerencie sua célula e cuide dos membros"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Church className="w-4 h-4 mr-2" />
                {user.role === "supervisor" ? "Acompanhar Células" : "Gerenciar Minha Célula"}
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Relatório de Membros
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserCheck className="w-4 h-4 mr-2" />
                Registro de Presença
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
