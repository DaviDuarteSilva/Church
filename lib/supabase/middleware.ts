import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Verificar se as variáveis de ambiente do Supabase estão disponíveis
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function updateSession(request: NextRequest) {
  // Se o Supabase não estiver configurado, apenas continue sem autenticação
  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request,
    })
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.pathname === "/") {
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Verificar se é um callback de autenticação
  const code = requestUrl.searchParams.get("code")

  if (code) {
    // Trocar o código por uma sessão
    await supabase.auth.exchangeCodeForSession(code)
    // Redirecionar para a página inicial após autenticação bem-sucedida
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/") || request.nextUrl.pathname === "/auth/callback"

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedRoute) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const redirectUrl = new URL("/auth/login", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      const redirectUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}
