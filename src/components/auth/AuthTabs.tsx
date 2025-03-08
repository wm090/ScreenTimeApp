import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

interface AuthTabsProps {
  onSignIn: (userId: string, nickname: string) => void;
  initialTab?: "login" | "register" | "forgot-password" | "reset-password";
  resetToken?: string;
}

const AuthTabs = ({
  onSignIn,
  initialTab = "login",
  resetToken,
}: AuthTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof initialTab);
  };

  return (
    <Tabs
      defaultValue={initialTab}
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full max-w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-4">
        <LoginForm
          onSignIn={onSignIn}
          onForgotPassword={() => setActiveTab("forgot-password")}
        />
      </TabsContent>

      <TabsContent value="register" className="mt-4">
        <RegisterForm onSuccess={() => setActiveTab("login")} />
      </TabsContent>

      <TabsContent value="forgot-password" className="mt-4">
        <ForgotPasswordForm
          onCancel={() => setActiveTab("login")}
          onSuccess={() => setActiveTab("login")}
        />
      </TabsContent>

      <TabsContent value="reset-password" className="mt-4">
        <ResetPasswordForm
          resetToken={resetToken || ""}
          onSuccess={() => setActiveTab("login")}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
