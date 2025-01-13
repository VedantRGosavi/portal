import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSubmit: (e: React.FormEvent) => Promise<void>
  onGoogleSignUp: () => Promise<void>
  onGitHubSignUp: () => Promise<void>
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  loading: boolean
  error: string | null
  logoSrc?: string
}

export function SignupForm({
  className,
  onSubmit,
  onGoogleSignUp,
  onGitHubSignUp,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  logoSrc = "/images/logo.svg",
  ...props
}: SignupFormProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    onSubmit(new Event('submit') as unknown as React.FormEvent)
    setShowConfirmDialog(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-black/50 backdrop-blur-sm border-[#005CB9]/30">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleFormSubmit} className="p-6 md:p-8 text-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white">Create an account</h1>
                <p className="text-balance text-gray-400">
                  Sign up for your RocketHacks Inc account
                </p>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <p className="text-sm text-yellow-500">
                  Please use a non-edu email. We apologize for this inconvenience.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                {passwordError && (
                  <span className="text-red-500 text-sm">{passwordError}</span>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#15397F] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#15397F]"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-800">
                <span className="relative z-10 bg-black px-2 text-gray-400">
                  Or sign up with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={onGoogleSignUp}
                  disabled={loading}
                  className="w-full bg-slate-700 hover:bg-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span className="sr-only">Sign up with Google</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onGitHubSignUp}
                  disabled={loading}
                  className="w-full bg-slate-700 hover:bg-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span className="sr-only">Sign up with GitHub</span>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4 text-white hover:text-[#FFDA00]">
                  Log in
                </a>
              </div>
            </div>
          </form>
          
          <div className="relative hidden md:block">
            <img
              src={logoSrc}
              alt="Logo"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-auto"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#FFDA00]">
        By signing up, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-black border border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Registration</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Please confirm your registration for RocketHacks. You will be able to complete your profile after verifying your email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-[#15397F] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#15397F]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

