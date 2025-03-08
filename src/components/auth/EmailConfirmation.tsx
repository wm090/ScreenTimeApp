import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { confirmEmail } from "../../lib/emailService";

interface EmailConfirmationProps {
  token: string;
  onComplete: () => void;
}

const EmailConfirmation = ({ token, onComplete }: EmailConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid confirmation link");
        setIsLoading(false);
        return;
      }

      try {
        await confirmEmail(token);
        setIsSuccess(true);
      } catch (err: any) {
        console.error("Email confirmation error:", err);
        setError(err.message || "Failed to confirm email");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full max-w-[400px] bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Email Confirmation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        {isLoading ? (
          <p>Verifying your email...</p>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-lg font-medium">Email Confirmed!</h3>
            <p className="text-gray-600">
              Your email has been successfully confirmed. You can now log in to
              your account.
            </p>
            <Button className="w-full mt-4" onClick={onComplete}>
              Continue to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h3 className="text-lg font-medium">Confirmation Failed</h3>
            <p className="text-red-600">{error}</p>
            <Button className="w-full mt-4" onClick={onComplete}>
              Back to Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailConfirmation;
