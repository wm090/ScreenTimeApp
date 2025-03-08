import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock, Save } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ResetPasswordFormProps {
  resetToken: string;
  onSuccess: () => void;
}

const ResetPasswordForm = ({
  resetToken,
  onSuccess,
}: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Verify token on component mount
    const verifyToken = async () => {
      if (!resetToken) {
        setTokenValid(false);
        setError("Invalid or missing reset token");
        return;
      }

      try {
        // Check if token exists and is not expired
        const { data, error } = await supabase
          .from("users")
          .select("id, reset_token_expires")
          .eq("reset_token", resetToken)
          .single();

        if (error || !data) {
          throw new Error("Invalid reset token");
        }

        // Check if token is expired
        const expiryDate = new Date(data.reset_token_expires);
        if (expiryDate < new Date()) {
          throw new Error("Reset token has expired");
        }

        setTokenValid(true);
        setUserId(data.id);
      } catch (err) {
        console.error("Token verification error:", err);
        setTokenValid(false);
        setError(
          "Invalid or expired reset token. Please request a new password reset link.",
        );
      }
    };

    verifyToken();
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenValid || !userId) {
      setError("Invalid reset token");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a new password");
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
      // Update password and clear reset token
      const { error } = await supabase
        .from("users")
        .update({
          password: password,
          reset_token: null,
          reset_token_expires: null,
        })
        .eq("id", userId);

      if (error) throw error;

      setSuccessMessage("Password has been reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
          <div className="mt-4 text-center">
            <Button onClick={onSuccess}>Back to Login</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokenValid === null) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="p-0 text-center">
          <p>Verifying reset token...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
          <div>
            <Label htmlFor="new-password" className="text-base font-medium">
              New Password
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="confirm-new-password"
              className="text-base font-medium"
            >
              Confirm New Password
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm new password"
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
            {isLoading ? "Resetting Password..." : "Reset Password"}
            {!isLoading && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
