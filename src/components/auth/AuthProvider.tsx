import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";

interface AuthContextType {
  userId: string | null;
  nickname: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (userId: string, nickname: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  nickname: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProviderComponent = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We're not forcing authentication on first load anymore
  // This allows users to stay logged in between sessions

  useEffect(() => {
    // Check for existing session from localStorage
    const checkLocalSession = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const { id, nickname: storedNickname } = JSON.parse(storedUser);

          // For demo user, skip verification
          if (
            id === "550e8400-e29b-41d4-a716-446655440000" &&
            storedNickname === "demo"
          ) {
            setUserId(id);
            setNickname(storedNickname);
            return;
          }

          // Verify user exists in mock database
          const mockUsers = JSON.parse(
            localStorage.getItem("mockUsers") || "[]",
          );
          const user = mockUsers.find((u) => u.id === id);

          if (!user) {
            // User doesn't exist in database, clear local storage
            localStorage.removeItem("currentUser");
            throw new Error("User not found in database");
          }

          setUserId(id);
          setNickname(user.nickname); // Use nickname from database
        }
      } catch (error) {
        console.error("Local session check error:", error);
        // Clear any potentially corrupted data
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    };

    // Check immediately to avoid flashing login screen
    checkLocalSession();
  }, []);

  const signIn = async (newUserId: string, newNickname: string) => {
    try {
      console.log("Signing in user:", { id: newUserId, nickname: newNickname });

      // For demo purposes, if using the demo account, skip verification
      if (
        newUserId === "550e8400-e29b-41d4-a716-446655440000" &&
        newNickname === "demo"
      ) {
        console.log("Using demo account, skipping verification");
      } else {
        // Verify user exists in Supabase
        const { data, error } = await supabase
          .from("users")
          .select("id, nickname, email_confirmed")
          .eq("id", newUserId)
          .single();

        if (error) {
          console.error("User verification failed:", error);
          throw new Error("User verification failed");
        }

        if (!data.email_confirmed) {
          console.warn("Attempting to sign in with unconfirmed email");
          // For demo purposes, we'll allow login anyway
        }
      }

      // Store user in localStorage for persistence
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: newUserId, nickname: newNickname }),
      );

      setUserId(newUserId);
      setNickname(newNickname);
      console.log("User signed in successfully");

      // Initialize user settings if they don't exist
      try {
        const { error: settingsError } = await supabase
          .from("user_settings")
          .upsert(
            {
              user_id: newUserId,
              quiet_hours_enabled: false,
              quiet_hours_start: "22:00",
              quiet_hours_end: "07:00",
            },
            { onConflict: "user_id" },
          );

        if (settingsError) {
          console.error("Error initializing user settings:", settingsError);
        }
      } catch (settingsError) {
        console.error("Error initializing user settings:", settingsError);
        // Continue anyway - this is not critical
      }
    } catch (error) {
      console.error("Sign in error:", error);
      // Clear any potentially corrupted data
      localStorage.removeItem("currentUser");
      setUserId(null);
      setNickname(null);
    }
  };

  const signOut = async () => {
    // Remove from localStorage
    localStorage.removeItem("currentUser");
    setUserId(null);
    setNickname(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        nickname,
        isAuthenticated: !!userId,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = AuthProviderComponent;
