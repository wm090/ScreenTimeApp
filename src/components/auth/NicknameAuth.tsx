import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Smartphone, User, ArrowRight, UserCheck, Lock } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface NicknameAuthProps {
  onSignIn: (userId: string, nickname: string) => void;
}

const NicknameAuth = ({ onSignIn }: NicknameAuthProps) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentUsers, setRecentUsers] = useState<
    { id: string; nickname: string }[]
  >([]);

  useEffect(() => {
    // Load recent users from local storage
    const storedUsers = localStorage.getItem("recentUsers");
    if (storedUsers) {
      try {
        setRecentUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Failed to parse recent users", e);
      }
    }
  }, []);

  const handleSignIn = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if user with this nickname already exists
      const { data: existingUsers, error: fetchError } = await supabase
        .from("users")
        .select("id, nickname, password")
        .eq("nickname", nickname)
        .limit(1);

      if (fetchError) throw fetchError;

      let userId;

      if (existingUsers && existingUsers.length > 0) {
        // User exists, verify password
        const user = existingUsers[0];
        console.log("Found existing user:", {
          nickname: user.nickname,
          hasPassword: !!user.password,
        });

        if (user.password && user.password !== password) {
          console.warn("Password mismatch for user:", user.nickname);
          throw new Error("Incorrect password");
        }

        // Password is correct or not set yet (for existing users)
        userId = user.id;

        // Update password if it wasn't set before
        if (!user.password) {
          console.log("Setting password for existing user:", user.nickname);
          await supabase.from("users").update({ password }).eq("id", userId);
        }
      } else {
        // Create a new user
        console.log("Creating new user with nickname:", nickname);
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              nickname,
              password,
              email: `${nickname.toLowerCase()}@example.com`,
              email_confirmed: true, // Auto-confirm for nickname auth
            },
          ])
          .select("id, nickname")
          .single();

        if (insertError) {
          console.error("Error creating user:", insertError);
          throw insertError;
        }
        if (!newUser) throw new Error("Failed to create user");

        console.log("New user created:", newUser);
        userId = newUser.id;
      }

      // Add to recent users in local storage
      const newRecentUser = { id: userId, nickname };
      const updatedRecentUsers = [
        newRecentUser,
        ...recentUsers.filter((u) => u.id !== userId).slice(0, 4),
      ];
      localStorage.setItem("recentUsers", JSON.stringify(updatedRecentUsers));

      // Call the onSignIn callback
      onSignIn(userId, nickname);
    } catch (err) {
      console.error("Error during sign in:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentUserSelect = (userId: string, nickname: string) => {
    setNickname(nickname);
    setError("");
    // Focus the password field
    document.getElementById("password")?.focus();
  };

  return (
    <Card className="w-full max-w-[400px] bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle className="text-xl">App Usage Monitor</CardTitle>
            <CardDescription>Enter a nickname to get started</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nickname" className="text-base font-medium">
            Your Nickname
          </Label>
          <div className="mt-1 relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nickname"
              placeholder="Enter a nickname"
              className="pl-10"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                document.getElementById("password")?.focus()
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-base font-medium">
            Password
          </Label>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        {recentUsers.length > 0 && (
          <div className="pt-2">
            <Label className="text-sm text-gray-500 mb-2 block">
              Recent Users
            </Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRecentUserSelect(user.id, user.nickname)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>{user.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Continue"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NicknameAuth;
