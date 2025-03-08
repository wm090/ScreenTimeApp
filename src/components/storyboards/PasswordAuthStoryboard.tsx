import React from "react";
import NicknameAuth from "../auth/NicknameAuth";

const PasswordAuthStoryboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <NicknameAuth
        onSignIn={(userId, nickname) =>
          console.log("Signed in:", userId, nickname)
        }
      />
    </div>
  );
};

export default PasswordAuthStoryboard;
