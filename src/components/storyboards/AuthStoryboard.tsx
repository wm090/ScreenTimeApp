import React from "react";
import AuthContainer from "../auth/AuthContainer";

const AuthStoryboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthContainer
        onSignIn={(userId, nickname) =>
          console.log("Signed in:", userId, nickname)
        }
      />
    </div>
  );
};

export default AuthStoryboard;
