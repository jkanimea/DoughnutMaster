import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(search).get("token") || "";

  const validateQuery = useQuery({
    queryKey: ["validateResetToken", token],
    queryFn: async () => {
      if (!token) return { valid: false };
      const response = await fetch(`/api/auth/reset-password/${token}`);
      return response.json();
    },
    enabled: !!token,
  });

  const resetMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      toast({ title: "Password reset!", description: "You can now login with your new password." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    resetMutation.mutate({ token, password });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md" data-testid="reset-password-invalid">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-900">Invalid Link</CardTitle>
            <CardDescription>This password reset link is invalid or missing.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <a href="/forgot-password" className="text-amber-600 hover:underline">
              Request a new reset link
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (validateQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validateQuery.data && !validateQuery.data.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md" data-testid="reset-password-expired">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-900">Link Expired</CardTitle>
            <CardDescription>This password reset link has expired or already been used.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <a href="/forgot-password" className="text-amber-600 hover:underline" data-testid="link-new-reset">
              Request a new reset link
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md" data-testid="reset-password-success">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-900">Password Reset!</CardTitle>
            <CardDescription>Your password has been successfully reset.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button 
              onClick={() => setLocation("/login")}
              className="bg-amber-600 hover:bg-amber-700"
              data-testid="btn-go-login"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md" data-testid="reset-password-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-900">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                data-testid="input-confirm-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={resetMutation.isPending}
              data-testid="btn-reset-password"
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
