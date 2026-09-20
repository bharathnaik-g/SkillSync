import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, profileAPI, getToken, setToken, removeToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await profileAPI.getProfile();
      setUser(res.user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    if (res.token) {
      setToken(res.token);
      // Fetch full profile to get user details including skills
      try {
        const profileRes = await profileAPI.getProfile();
        setUser(profileRes.user);
      } catch (e) {
        setUser(res.user);
      }
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshProfile: fetchUserProfile,
      }}
    >
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
