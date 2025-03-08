import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailConfirmation from "../components/auth/EmailConfirmation";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <EmailConfirmation token={token} onComplete={handleComplete} />
    </div>
  );
};

export default ConfirmEmail;
