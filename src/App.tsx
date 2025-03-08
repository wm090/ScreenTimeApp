import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import AuthContainer from "./components/auth/AuthContainer";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword";

function AppContent() {
  const { isAuthenticated, isLoading, signIn } = useAuth();

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

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
