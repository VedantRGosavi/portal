// /app/auth/callback/route.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, { ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete(name)
          },
        },
      }
    )

    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      if (!session?.user) throw new Error('No user found')

      // Check if this is a login attempt (user already exists)
      const { data: existingProfile } = await supabase
        .from('profile')
        .select('id')
        .eq('id', session.user.id)
        .single()

      // If no existing profile and this is a login attempt (not signup)
      if (!existingProfile && requestUrl.pathname === '/auth/callback') {
        // Delete the newly created auth user since this was a login attempt
        await supabase.auth.admin.deleteUser(session.user.id)
        return NextResponse.redirect(
          new URL('/auth/login?error=no_account', requestUrl.origin)
        )
      }

      // Handle profile creation for OAuth providers
      if (session.user.app_metadata.provider === 'github' || session.user.app_metadata.provider === 'google') {
        const { data: existingProfile } = await supabase
          .from('profile')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!existingProfile) {
          // Get display name from various possible OAuth metadata fields
          const metadata = session.user.user_metadata
          const displayName = metadata.full_name || 
                            metadata.name ||
                            metadata.user_name || 
                            metadata.username || 
                            session.user.email?.split('@')[0] || 
                            'User'

          await supabase
            .from('profile')
            .insert({
              id: session.user.id,
              email: session.user.email,
              display_name: displayName,
              role: 'applicant',
              is_profile_complete: false,
              created_at: new Date().toISOString()
            })
        }
      }

      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profile')
        .select('is_profile_complete')
        .eq('id', session.user.id)
        .single()

      if (!profile?.is_profile_complete) {
        return NextResponse.redirect(new URL('/profile', requestUrl.origin))
      }

      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
} 