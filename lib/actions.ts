"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Função para fazer login
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Dados do formulário estão faltando" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  const supabase = createSupabaseServerClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro no login:", error)
    return { error: "Ocorreu um erro inesperado. Tente novamente." }
  }
}

// Função para cadastrar usuário
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Dados do formulário estão faltando" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const username = formData.get("username")
  const fullName = formData.get("fullName")
  const role = formData.get("role")

  if (!email || !password || !username || !fullName || !role) {
    return { error: "Todos os campos são obrigatórios" }
  }

  const supabase = createSupabaseServerClient()

  try {
    // Primeiro, criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    // Se o usuário foi criado com sucesso, inserir dados adicionais na tabela users
    if (authData.user) {
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: email.toString(),
        username: username.toString(),
        full_name: fullName.toString(),
        role: role.toString(),
      })

      if (dbError) {
        console.error("Erro ao inserir dados do usuário:", dbError)
        return { error: "Erro ao salvar dados do usuário. Tente novamente." }
      }
    }

    return { success: "Cadastro realizado com sucesso! Redirecionando..." }
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return { error: "Ocorreu um erro inesperado. Tente novamente." }
  }
}

// Função para fazer logout
export async function signOut() {
  const supabase = createSupabaseServerClient()

  await supabase.auth.signOut()
  return { success: true }
}
