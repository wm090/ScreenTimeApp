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

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session from localStorage
    const checkLocalSession = () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const { id, nickname: storedNickname } = JSON.parse(storedUser);
          setUserId(id);
          setNickname(storedNickname);
        }
      } catch (error) {
        console.error("Local session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLocalSession();
  }, []);

  const signIn = (newUserId: string, newNickname: string) => {
    // Store user in localStorage for persistence
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ id: newUserId, nickname: newNickname }),
    );
    setUserId(newUserId);
    setNickname(newNickname);
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
