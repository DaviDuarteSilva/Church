"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Church, Users, LogOut, Calendar, MapPin } from "lucide-react"
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

interface Celula {
  id: string
  nome: string
  descricao: string
  endereco: string
  dia_semana: string
  horario: string
  lider?: {
    full_name: string
  }
}

export default function MembroDashboard({ user }: { user: User }) {
  const [celula, setCelula] = useState<Celula | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Buscar célula do membro
      const { data: celulaMembro } = await supabase
        .from("celula_membros")
        .select(`
          celula_id,
          celulas (
            id,
            nome,
            descricao,
            endereco,
            dia_semana,
            horario,
            lider:users!celulas_lider_id_fkey(full_name)
          )
        `)
        .eq("user_id", user.id)
        .eq("ativo", true)
        .single()

      if (celulaMembro?.celulas) {
        setCelula(celulaMembro.celulas as any)
      }
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.full_name}</p>
                <Badge className="bg-blue-100 text-blue-800 mt-1">
                  {user.role === "auxiliar" ? "Auxiliar" : "Membro"}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações da Célula */}
        {celula ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Church className="w-5 h-5 mr-2" />
                Minha Célula: {celula.nome}
              </CardTitle>
              <CardDescription>{celula.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Líder:</span>
                    <span className="ml-1">{celula.lider?.full_name || "Não definido"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Reunião:</span>
                    <span className="ml-1">
                      {celula.dia_semana} às {celula.horario}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Local:</span>
                    <span className="ml-1">{celula.endereco}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Você ainda não está em uma célula</CardTitle>
              <CardDescription>Entre em contato com a liderança para ser adicionado a uma célula</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Ações Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Nome:</span> {user.full_name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Usuário:</span> {user.username}
                </div>
                <div>
                  <span className="font-medium">Membro desde:</span>{" "}
                  {new Date(user.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>O que você pode fazer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline" disabled={!celula}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Próximas Reuniões
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Contatar Liderança
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
