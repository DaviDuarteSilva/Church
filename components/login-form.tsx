"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Church } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"

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
          Entrando...
        </>
      ) : (
        "Entrar"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<{ error?: string; success?: boolean } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Lidar com login bem-sucedido redirecionando
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await signIn(null, formData)
        setState(result)
      } catch (error) {
        setState({ error: "Erro ao fazer login. Tente novamente." })
      }
    })
  }

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mb-6">
              <img src="lgblack.png" className="h-32 w-32 mx-auto mb-4 rounded-lg" />
            </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Sistema da Igreja</CardTitle>
        <CardDescription className="text-lg text-gray-600">Entre com sua conta para acessar o sistema</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{state.error}</div>
          )}

          <div className="space-y-4">
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
          </div>

          <SubmitButton isPending={isPending} />

          <div className="text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/auth/cadastro" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
