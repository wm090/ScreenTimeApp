import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContainer from "../components/auth/AuthContainer";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const handleSignIn = (userId: string, nickname: string) => {
    // This won't be called directly from this page, but we need to provide it
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthContainer
        onSignIn={handleSignIn}
        initialTab="reset-password"
        resetToken={token}
      />
    </div>
  );
};

export default ResetPassword;
