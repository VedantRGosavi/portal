"use client";
// app/auth/signup/page.tsx
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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Validate required fields
      if (!email || !password || !fullName || !dob || !school) {
        throw new Error("Please fill in all required fields");
      }

      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `https://portal.rockethacks.org/auth/callback`,
        },
      });

      if (signUpError) {
        console.error("Auth Error:", signUpError);
        throw signUpError;
      }

      if (!authData.user?.id) {
        throw new Error("No user ID returned from signup");
      }

      // 2. Create profile
      // Inside handleSubmit function
      const { error: profileError } = await supabase
        .from('profile')
        .insert({
          id: authData.user.id,
          display_name: fullName,
          email: email,
          dob: new Date(dob).toISOString().split('T')[0],
          school: school,
          role: 'applicant',
          is_profile_complete: false,
          created_at: new Date().toISOString()
        })
        .single();

      if (profileError) {
        console.error("Profile Error:", profileError);
        // Don't sign out the user immediately, maybe just show an error message
        setError("Failed to create profile. Please try again.");
        return;
      }

      // Update profile with is_profile_complete flag
      const { error: updateError } = await supabase
        .from('profile')
        .update({ is_profile_complete: false })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error("Profile Update Error:", updateError);
      }

      router.push('/auth/verify-email');
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `https://portal.rockethacks.org/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred with GitHub signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm 
          onSubmit={handleSubmit}
          onGitHubSignUp={handleGitHubSignUp}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          dob={dob}
          setDob={setDob}
          school={school}
          setSchool={setSchool}
          loading={loading}
          error={error}
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