"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Church } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cadastrando...
        </>
      ) : (
        "Cadastrar"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, setState] = useState<{ error?: string; success?: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [selectedRole, setSelectedRole] = useState<string>("")

  const handleSubmit = async (formData: FormData) => {
    if (selectedRole && !formData.get("role")) {
      formData.set("role", selectedRole)
    }

    startTransition(async () => {
      try {
        const result = await signUp(null, formData)
        setState(result)

        if (result.success && !result.error) {
          window.location.href = "/dashboard"
        }
      } catch (error) {
        setState({ error: "Erro ao processar cadastro" })
      }
    })
  }

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mb-6">
              <img src="lgblack.png" className="h-32 w-32 mx-auto mb-4 rounded-lg" />
            </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Criar Conta</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Cadastre-se para acessar o sistema da igreja
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {state.success}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Seu nome completo"
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Confirme dua Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Função na Igreja
              </label>
              <Select name="role" required value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Selecione sua função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membro">Membro</SelectItem>
                  <SelectItem value="auxiliar">Auxiliar</SelectItem>
                  <SelectItem value="lider_celula">Líder de Célula</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                  <SelectItem value="pastor_presidente">Pastor Presidente</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="role" value={selectedRole} />
            </div>
          </div>

          <SubmitButton isPending={isPending} />

          <div className="text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
