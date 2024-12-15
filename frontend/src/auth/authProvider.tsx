import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import cookieExists from "./cookieExists";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// Define the shape of authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Define the authentication provider component
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(cookieExists);
  const { toast } = useToast();

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setIsAuthenticated(false);
        toast({
          title: "Prisijungimas reikalingas",
          description: `Norėdami pasiekti šį puslapį, turite prisijungti.`,
          duration: 8000,
          className: "bg-red-50 text-red-600 border border-red-200", // Apply light red background color
        });
      }
      return Promise.reject(error);
    }
  );

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
    }),
    [isAuthenticated]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to consume the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
