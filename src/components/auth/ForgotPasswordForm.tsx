import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { sendPasswordResetEmail } from "../../lib/emailService";

interface ForgotPasswordFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ForgotPasswordForm = ({
  onCancel,
  onSuccess,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(email.toLowerCase());

      setSuccessMessage(
        "If an account exists with this email, you will receive a password reset link.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      // Don't reveal if email exists or not for security
      setSuccessMessage(
        "If an account exists with this email, you will receive a password reset link.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
          <div>
            <Label htmlFor="reset-email" className="text-base font-medium">
              Email
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-500">{successMessage}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between px-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
            {!isLoading && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
