import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const scoutId = localStorage.getItem("scoutId");
    const scoutName = localStorage.getItem("scoutName");

    if (token && scoutId && scoutName) {
      setUser({
        scout_id: parseInt(scoutId),
        name: scoutName,
      });
    }
    setLoading(false);
  }, []);

  const login = (scoutData) => {
    setUser(scoutData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("scoutId");
    localStorage.removeItem("scoutName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
