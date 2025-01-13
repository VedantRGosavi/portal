"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SignupForm } from "@/components/ui/signup-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AuthError } from "@supabase/supabase-js";

type SignupError = {
  message: string;
  code?: string;
  details?: string;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const router = useRouter();

  const handleAuthError = (error: AuthError): SignupError => {
    // Handle known Supabase auth errors
    switch (error.status) {
      case 400:
        if (error.message.includes("password")) {
          return {
            message: "Password must be at least 6 characters long",
            code: "auth/weak-password",
            details: error.message
          };
        }
        if (error.message.includes("email")) {
          return {
            message: "Please enter a valid email address",
            code: "auth/invalid-email",
            details: error.message
          };
        }
        break;
      case 422:
        return {
          message: "Email address is already in use",
          code: "auth/email-already-in-use",
          details: error.message
        };
      case 429:
        return {
          message: "Too many requests. Please try again later",
          code: "auth/too-many-requests",
          details: error.message
        };
      default:
        return {
          message: "An unexpected error occurred. Please try again",
          code: "auth/unknown",
          details: error.message
        };
    }
    return {
      message: error.message,
      code: "auth/unknown",
      details: error.message
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Input validation
      if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in all required fields");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Password strength validation
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up the user with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: 'applicant'
          }
        },
      });

      if (signUpError) {
        console.error("Auth Error:", signUpError);
        throw signUpError;
      }

      setShowVerifyDialog(true);
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof AuthError) {
        setError(handleAuthError(err));
      } else {
        setError({
          message: err instanceof Error ? err.message : "An unexpected error occurred",
          code: "unknown",
          details: err instanceof Error ? err.stack : undefined
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error(`${provider} signup error:`, err);
      if (err instanceof AuthError) {
        setError(handleAuthError(err));
      } else {
        setError({
          message: `An error occurred with ${provider} signup`,
          code: "oauth-error",
          details: err instanceof Error ? err.message : undefined
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm 
          onSubmit={handleSubmit}
          onGoogleSignUp={() => handleOAuthSignUp('google')}
          onGitHubSignUp={() => handleOAuthSignUp('github')}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error?.message || null}
          logoSrc="/images/logo.svg"
        />
      </div>

      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Check your email</AlertDialogTitle>
            <AlertDialogDescription>
              We've sent you an email verification link. Please check your inbox and click the link to verify your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => router.push("/auth/verify-email")}>
            Continue
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 