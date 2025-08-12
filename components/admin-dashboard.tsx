"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Church, Plus, Edit, Trash2, LogOut, UserCheck } from "lucide-react"
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
  lider_id: string
  supervisor_id: string
  endereco: string
  dia_semana: string
  horario: string
  ativa: boolean
  lider?: User
  supervisor?: User
}

export default function AdminDashboard({ user }: { user: User }) {
  const [users, setUsers] = useState<User[]>([])
  const [celulas, setCelulas] = useState<Celula[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCelulas: 0,
    celulasAtivas: 0,
    membrosAtivos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar usuários
      const { data: usersData } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      // Carregar células com líderes e supervisores
      const { data: celulasData } = await supabase
        .from("celulas")
        .select(`
          *,
          lider:users!celulas_lider_id_fkey(id, full_name, username),
          supervisor:users!celulas_supervisor_id_fkey(id, full_name, username)
        `)
        .order("created_at", { ascending: false })

      if (usersData) setUsers(usersData)
      if (celulasData) setCelulas(celulasData)

      // Calcular estatísticas
      setStats({
        totalUsers: usersData?.length || 0,
        totalCelulas: celulasData?.length || 0,
        celulasAtivas: celulasData?.filter((c) => c.ativa).length || 0,
        membrosAtivos: usersData?.filter((u) => u.role !== "admin").length || 0,
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      const { error } = await supabase.from("users").delete().eq("id", userId)
      if (!error) {
        loadData()
      }
    }
  }

  const handleDeleteCelula = async (celulaId: string) => {
    if (confirm("Tem certeza que deseja excluir esta célula?")) {
      const { error } = await supabase.from("celulas").delete().eq("id", celulaId)
      if (!error) {
        loadData()
      }
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      pastor_presidente: "bg-purple-100 text-purple-800",
      pastor: "bg-blue-100 text-blue-800",
      supervisor: "bg-green-100 text-green-800",
      lider_celula: "bg-yellow-100 text-yellow-800",
      auxiliar: "bg-gray-100 text-gray-800",
      membro: "bg-slate-100 text-slate-800",
    }

    const roleNames = {
      admin: "Administrador",
      pastor_presidente: "Pastor Presidente",
      pastor: "Pastor",
      supervisor: "Supervisor",
      lider_celula: "Líder de Célula",
      auxiliar: "Auxiliar",
      membro: "Membro",
    }

    return (
      <Badge className={roleColors[role as keyof typeof roleColors]}>{roleNames[role as keyof typeof roleNames]}</Badge>
    )
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.full_name}</p>
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
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

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
              <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.membrosAtivos}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Gerenciamento */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
            <TabsTrigger value="celulas">Gerenciar Células</TabsTrigger>
          </TabsList>

          {/* Tab de Usuários */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Usuários do Sistema</CardTitle>
                    <CardDescription>Gerencie todos os usuários cadastrados no sistema</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.username}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {u.role !== "admin" && (
                              <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Células */}
          <TabsContent value="celulas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Células da Igreja</CardTitle>
                    <CardDescription>Gerencie todas as células e seus líderes</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Célula
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Líder</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Dia/Horário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {celulas.map((celula) => (
                      <TableRow key={celula.id}>
                        <TableCell className="font-medium">{celula.nome}</TableCell>
                        <TableCell>{celula.lider?.full_name || "Não definido"}</TableCell>
                        <TableCell>{celula.supervisor?.full_name || "Não definido"}</TableCell>
                        <TableCell>
                          {celula.dia_semana} às {celula.horario}
                        </TableCell>
                        <TableCell>
                          <Badge className={celula.ativa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {celula.ativa ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteCelula(celula.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
