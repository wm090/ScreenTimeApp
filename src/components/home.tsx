import React, { useEffect } from "react";
import AndroidHome from "./android/AndroidHome";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import AuthContainer from "./auth/AuthContainer";

const Home = () => {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const navigate = useNavigate();

  // Force authentication check on component mount
  useEffect(() => {
    // Clear any stored user to force authentication
    if (!isAuthenticated && !isLoading) {
      localStorage.removeItem("currentUser");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <AuthContainer onSignIn={signIn} />
      </div>
    );
  }

  return <AndroidHome />;
};

export default Home;
