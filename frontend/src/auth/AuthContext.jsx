import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // API base URL
  const API_BASE = 'http://localhost:5000/api';

  // Check auth on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setToken(token);
        setUser(data.user);
      } else {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function - using role and password
  const login = async (role, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  // Check permissions
  const hasPermission = (route) => {
    if (!user || !user.role) return false;
    return user.permissions?.includes(route) || false;
  };

  // Get accessible menu items
  const getAccessibleMenuItems = () => {
    if (!user || !user.role) return [];

    const allMenuItems = [
      { title: "Add Candidate", icon: "👤", route: "add-candidate" },
      { title: "Manage Candidate", icon: "👥", route: "manage-candidates" },
      { title: "Feed Marks", icon: "📊", route: "feed-marks" },
      { title: "Marksheet/Certificate", icon: "📝", route: "marksheets" },
      { title: "ID Card", icon: "🪪", route: "id-cards" },
      { title: "Custom Letter", icon: "📄", route: "letters" }
    ];

    return allMenuItems.filter((item) =>
      user.permissions?.includes(item.route)
    );
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, userRole: user?.role || null, login, logout, hasPermission, getAccessibleMenuItems, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for auth
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
