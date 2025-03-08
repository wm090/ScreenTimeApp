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
import { Smartphone, User, ArrowRight, UserCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface NicknameAuthProps {
  onSignIn: (userId: string, nickname: string) => void;
}

const NicknameAuth = ({ onSignIn }: NicknameAuthProps) => {
  const [nickname, setNickname] = useState("");
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

    setIsLoading(true);
    setError("");

    try {
      // For demo purposes, we'll bypass Supabase authentication
      // and just use the nickname directly
      const mockUserId = `user-${Date.now()}`;

      // Add to recent users in local storage
      const newRecentUser = { id: mockUserId, nickname };
      const updatedRecentUsers = [
        newRecentUser,
        ...recentUsers.filter((u) => u.nickname !== nickname).slice(0, 4),
      ];
      localStorage.setItem("recentUsers", JSON.stringify(updatedRecentUsers));

      // Call the onSignIn callback
      onSignIn(mockUserId, nickname);
    } catch (err) {
      console.error("Error during sign in:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentUserSelect = (userId: string, nickname: string) => {
    onSignIn(userId, nickname);
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
            <div className="space-y-2">
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
