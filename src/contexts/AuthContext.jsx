import { createContext, useContext, useState, useEffect } from "react";
import { auth, signUp, signIn, logoutUser } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    setError(null);
    const result = await signUp(email, password, displayName);
    if (result.error) {
      setError(result.error);
      return false;
    }
    setCurrentUser(result.user);
    return true;
  };

  const login = async (email, password) => {
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return false;
    }
    setCurrentUser(result.user);
    return true;
  };

  const logout = async () => {
    setError(null);
    const result = await logoutUser();
    if (result.error) {
      setError(result.error);
      return false;
    }
    setCurrentUser(null);
    return true;
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}