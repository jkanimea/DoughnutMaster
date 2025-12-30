import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reset email");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      if (data.token) {
        setResetToken(data.token);
      }
      toast({ title: "Check your email", description: "If an account exists, you will receive a password reset link." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md" data-testid="forgot-password-success">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-900">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            {resetToken && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 mb-2">Development mode: Reset link</p>
                <a 
                  href={`/reset-password?token=${resetToken}`}
                  className="text-amber-600 hover:underline text-sm break-all"
                  data-testid="link-reset-token"
                >
                  Click here to reset password
                </a>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSubmitted(false)}
              data-testid="btn-try-again"
            >
              Try another email
            </Button>
            <a href="/login" className="text-sm text-amber-600 hover:underline">
              Back to login
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md" data-testid="forgot-password-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-900">Forgot Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={forgotPasswordMutation.isPending}
              data-testid="btn-send-reset"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <a href="/login" className="flex items-center gap-2 text-sm text-amber-600 hover:underline" data-testid="link-back-login">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
