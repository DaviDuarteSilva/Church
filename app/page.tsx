"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Shield, Star, UserCheck, User, BookOpen, Handshake } from "lucide-react"

export default function Home() {
  const userTypes = [
    { name: "Pastor Presidente", icon: Star, color: "bg-yellow-500" },
    { name: "Pastor", icon: Shield, color: "bg-blue-500" },
    { name: "Supervisor", icon: UserCheck, color: "bg-green-500" },
    { name: "Líder de Célula", icon: Users, color: "bg-purple-500" },
    { name: "Auxiliar", icon: Heart, color: "bg-pink-500" },
    { name: "Membro", icon: User, color: "bg-gray-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6">
              <img src="lgwhite.png" className="h-32 w-32 mx-auto mb-4 rounded-lg" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Nossa Igreja
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Uma Família
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
              Fortalecendo nossa comunidade através das células. Um lugar onde cada membro é valorizado, cada líder é
              equipado e cada célula floresce no amor de Cristo.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border-blue-200/20 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-8">
              <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                "Fazer discípulos que fazem discípulos, conectando corações através das células e transformando vidas
                pelo poder do Evangelho. Cada membro é importante, cada célula é essencial, cada líder é um instrumento
                de Deus."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Como Cuidamos da Nossa Família</h2>
            <p className="mt-4 text-lg text-blue-100">Ferramentas que nos ajudam a pastorear com excelência</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-blue-200/20 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-white">Células Conectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Acompanhe o crescimento de cada célula, organize reuniões e fortaleça os laços de comunhão.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200/20 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <Heart className="h-8 w-8 text-purple-400" />
                <CardTitle className="text-white">Cuidado Pastoral</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Registre orações, acompanhe necessidades e celebre vitórias junto com nossa família.
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-200/20 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <Handshake className="h-8 w-8 text-indigo-400" />
                <CardTitle className="text-white">Liderança Equipada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-100">
                  Capacite líderes, supervisores e pastores com as ferramentas certas para servir melhor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Faça Parte da Família</h2>
            <p className="mt-4 text-lg text-blue-100">
              Entre na sua área pessoal ou cadastre-se para começar a participar
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Login Card */}
            <Card className="border-blue-200/20 bg-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Bem-vindo de volta!</CardTitle>
                <CardDescription className="text-blue-100">Acesse sua área pessoal e continue servindo</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Entrar na Minha Área
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Register Card */}
            <Card className="border-purple-200/20 bg-white/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Primeira vez aqui?</CardTitle>
                <CardDescription className="text-purple-100">
                  Cadastre-se e comece a fazer parte da nossa família
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/cadastro" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-purple-400 text-purple-100 hover:bg-purple-600 hover:text-white bg-transparent"
                    size="lg"
                  >
                    Quero Me Cadastrar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ministérios e Funções</h2>
            <p className="mt-4 text-lg text-blue-100">
              Cada pessoa tem um chamado especial e um lugar importante na nossa igreja
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <div className={`rounded-full p-2 ${type.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{type.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-200">
            © 2024 Sistema da Nossa Igreja. Desenvolvido com ❤️ para nossa família em Cristo.
          </p>
        </div>
      </footer>
    </div>
  )
}
