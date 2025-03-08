import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Lock, Mail, UserPlus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { sendConfirmationEmail } from "../../lib/emailService";

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    e.preventDefault();

    // Validate inputs
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Starting registration process for:", {
        nickname,
        email: email.toLowerCase(),
      });

      // For demo purposes, if using demo@example.com, show a special message
      if (email.toLowerCase() === "demo@example.com") {
        console.log("Demo account registration attempted");
        setError(
          "This email is reserved for demo purposes. Please use a different email.",
        );
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const { data: existingUsers, error: emailCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase())
        .limit(1);

      console.log("Email check result:", {
        existingUsers,
        error: emailCheckError?.message,
      });

      if (emailCheckError) throw emailCheckError;

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Email already in use");
      }

      // Check if nickname already exists
      const { data: existingNicknames, error: nicknameCheckError } =
        await supabase
          .from("users")
          .select("id")
          .eq("nickname", nickname)
          .limit(1);

      console.log("Nickname check result:", {
        existingNicknames,
        error: nicknameCheckError?.message,
      });

      if (nicknameCheckError) throw nicknameCheckError;

      if (existingNicknames && existingNicknames.length > 0) {
        throw new Error("Nickname already in use");
      }

      try {
        // Create new user
        console.log("Creating new user:", {
          nickname,
          email: email.toLowerCase(),
        });

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              nickname,
              password,
              email: email.toLowerCase(),
              email_confirmed: true, // Auto-confirm for demo purposes
            },
          ])
          .select("id, nickname, email")
          .single();

        console.log("User creation result:", {
          success: !!newUser,
          error: insertError?.message,
        });

        if (insertError) {
          console.error("Error creating user:", insertError);
          throw insertError;
        }

        if (!newUser) {
          throw new Error("Failed to create user");
        }

        console.log("User created successfully:", newUser);

        // For demo purposes, we'll skip the email confirmation
        console.log("Skipping email confirmation for demo purposes");

        setSuccessMessage(
          "Registration successful! Your account has been created and is ready to use.",
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } catch (err) {
        console.error("Error in user creation:", err);
        throw err;
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4 p-0">
          <div>
            <Label
              htmlFor="register-nickname"
              className="text-base font-medium"
            >
              Nickname
            </Label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="register-nickname"
                placeholder="Choose a nickname"
                className="pl-10"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="register-email" className="text-base font-medium">
              Email
            </Label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="register-password"
              className="text-base font-medium"
            >
              Password
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="register-password"
                type="password"
                placeholder="Create a password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-base font-medium">
              Confirm Password
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-500">{successMessage}</p>
          )}
        </CardContent>

        <CardFooter className="px-0 pt-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
            {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
