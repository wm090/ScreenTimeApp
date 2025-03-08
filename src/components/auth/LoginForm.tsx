import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Lock, Mail, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface LoginFormProps {
  onSignIn: (userId: string, nickname: string) => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSignIn, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email: email.toLowerCase() });

      // Special case for demo user
      if (
        email.toLowerCase() === "demo@example.com" &&
        password === "password123"
      ) {
        console.log("Using demo account login");
        onSignIn("550e8400-e29b-41d4-a716-446655440000", "demo");
        return;
      }

      // Find user by email
      const { data: users, error: fetchError } = await supabase
        .from("users")
        .select("id, nickname, password, email, email_confirmed")
        .eq("email", email.toLowerCase())
        .limit(1);

      console.log("Login attempt result:", {
        email,
        foundUsers: users?.length,
        error: fetchError?.message,
      });

      if (fetchError) throw fetchError;

      if (!users || users.length === 0) {
        throw new Error("Incorrect email or password");
      }

      const user = users[0];
      console.log("Found user:", {
        nickname: user.nickname,
        hasPassword: !!user.password,
      });

      // Check if email is confirmed - for demo, we'll skip this check
      if (!user.email_confirmed) {
        console.warn(`Login attempt with unconfirmed email: ${user.email}`);
        console.log("Allowing login with unconfirmed email for demo purposes");
      }

      // Verify password
      console.log("Verifying password for user:", user.nickname);
      if (user.password !== password) {
        console.warn("Password mismatch for user:", user.nickname);
        throw new Error("Incorrect email or password");
      }
      console.log("Password verified successfully");

      // Login successful
      onSignIn(user.id, user.nickname);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 p-0">
          <div>
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-blue-600"
                onClick={onForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>

        <CardFooter className="px-0 pt-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
