import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const LoginDemoStoryboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Demo</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Demo Login Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Demo Account</h3>
              <p className="mb-2">Use these credentials to log in:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="font-medium">Email:</div>
                <div className="font-mono bg-white p-1 rounded border">
                  demo@example.com
                </div>
                <div className="font-medium">Password:</div>
                <div className="font-mono bg-white p-1 rounded border">
                  password123
                </div>
              </div>
              <Button onClick={() => navigate("/")} className="w-full">
                Go to Login Page
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">
                Register New Account
              </h3>
              <p className="mb-2">
                You can also register a new account with your own credentials.
              </p>
              <p className="text-sm text-green-700 mb-4">
                For demo purposes, email verification is automatically
                completed.
              </p>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                Go to Registration Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Login with email and password</li>
            <li>Registration with automatic email confirmation</li>
            <li>Password reset functionality</li>
            <li>Session persistence using localStorage</li>
            <li>Form validation and error handling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDemoStoryboard;
