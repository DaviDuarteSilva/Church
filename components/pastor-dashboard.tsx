"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Church, Users, LogOut, UserCheck, MapPin } from "lucide-react"
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

export default function PastorDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState({
    totalCelulas: 0,
    totalMembros: 0,
    celulasAtivas: 0,
    lideres: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar estatísticas gerais
      const { data: celulasData } = await supabase.from("celulas").select("*")
      const { data: usersData } = await supabase.from("users").select("*")

      setStats({
        totalCelulas: celulasData?.length || 0,
        totalMembros: usersData?.filter((u) => u.role === "membro").length || 0,
        celulasAtivas: celulasData?.filter((c) => c.ativa).length || 0,
        lideres: usersData?.filter((u) => u.role === "lider_celula").length || 0,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pastoral</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.full_name}</p>
                <Badge className="bg-purple-100 text-purple-800 mt-1">
                  {user.role === "pastor_presidente" ? "Pastor Presidente" : "Pastor"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Células</CardTitle>
              <Church className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCelulas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Células Ativas</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.celulasAtivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembros}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Líderes Ativos</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lideres}</div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral das Células</CardTitle>
              <CardDescription>Acompanhe o crescimento e desenvolvimento das células</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Células Ativas</p>
                    <p className="text-sm text-green-700">Funcionando normalmente</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.celulasAtivas}</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Taxa de Crescimento</p>
                    <p className="text-sm text-blue-700">Baseado no último mês</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">+12%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Ferramentas para gestão pastoral</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Relatório de Membros
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Church className="w-4 h-4 mr-2" />
                  Acompanhar Células
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Visitas Pastorais
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
