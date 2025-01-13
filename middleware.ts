// middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    // Auth routes - redirect to dashboard if logged in and verified
    if (request.nextUrl.pathname.startsWith('/auth/') && user?.email_confirmed_at) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Profile route - only accessible after email verification
    if (request.nextUrl.pathname === '/profile' && !user?.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url))
    }

    // Dashboard route - only accessible after profile completion
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      if (!user.email_confirmed_at) {
        return NextResponse.redirect(new URL('/auth/verify-email', request.url))
      }

      const { data: profile } = await supabase
        .from('profile')
        .select('is_profile_complete')
        .eq('id', user.id)
        .single()

      if (!profile?.is_profile_complete) {
        if (!request.nextUrl.pathname.startsWith('/profile')) {
          return NextResponse.redirect(new URL('/profile', request.url))
        }
      }
    }

    // Add a new condition for the profile route
    if (request.nextUrl.pathname.startsWith('/profile')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      if (!user.email_confirmed_at) {
        return NextResponse.redirect(new URL('/auth/verify-email', request.url))
      }
    }

    // Admin routes - only check for authentication
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    return response
  } catch (e) {
    if (request.nextUrl.pathname !== '/auth/login') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/profile',
    '/application',
    '/admin/:path*'
  ]
}
