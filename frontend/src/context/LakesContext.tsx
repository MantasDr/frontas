import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Point } from "geojson";
import { useAuth } from "@/auth/authProvider";

export type Lake = {
  id: number;
  name: string;
  area: number;
  depth: number;
  description: string;
  location: Point;
  isLiked: boolean;
  fishIds?: number[];
};

type LakesContextProps = {
  lakes: Lake[];
  isLoading: boolean;
  error: string | null;
  lovedOnly: boolean;
  setLovedOnly: (arg: boolean) => void;
  setLakes: (arg: Lake[]) => void;
  refetchLakes: () => void;
};

// Create LakesContext
export const LakesContext = createContext<LakesContextProps | undefined>(
  undefined
);

// Custom hook to use LakesContext
export const useLakes = () => {
  return useContext(LakesContext);
};

// LakesProvider component
export const LakesProvider = ({ children }) => {
  const [lakes, setLakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lovedOnly, setLovedOnly] = useState(false);

  // Use the isAuthenticated value from the useAuth hook
  const { isAuthenticated } = useAuth();

  const fetchLakes = async () => {
    // Check if the user is authenticated before fetching lakes
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("/lake");
      setLakes(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLakes();
  }, [isAuthenticated]); // Add isAuthenticated to the dependency array

  const refetchLakes = () => {
    setIsLoading(true);
    setError(null);
    fetchLakes();
  };

  const values = {
    lakes,
    isLoading,
    error,
    lovedOnly,
    setLovedOnly,
    setLakes,
    refetchLakes,
  };

  return (
    <LakesContext.Provider value={values}>{children}</LakesContext.Provider>
  );
};
