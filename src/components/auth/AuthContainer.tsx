import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Smartphone } from "lucide-react";
import AuthTabs from "./AuthTabs";

interface AuthContainerProps {
  onSignIn: (userId: string, nickname: string) => void;
  initialTab?: "login" | "register" | "forgot-password" | "reset-password";
  resetToken?: string;
}

const AuthContainer = ({
  onSignIn,
  initialTab = "login",
  resetToken,
}: AuthContainerProps) => {
  return (
    <Card className="w-full max-w-[400px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle className="text-xl">App Usage Monitor</CardTitle>
            <CardDescription>
              {initialTab === "login" && "Sign in to your account"}
              {initialTab === "register" && "Create a new account"}
              {initialTab === "forgot-password" && "Reset your password"}
              {initialTab === "reset-password" && "Set a new password"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <AuthTabs
        onSignIn={onSignIn}
        initialTab={initialTab}
        resetToken={resetToken}
      />
    </Card>
  );
};

export default AuthContainer;
