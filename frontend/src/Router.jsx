import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./auth/AuthContext";

const Login = lazy(() => import("./auth/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));

// Protected route wrapper
const ProtectedRoute = ({ children, requiredPermission }) => {
    const { userRole, hasPermission } = useAuth();

    if (!userRole) return <Navigate to="/login" replace />;
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const Router = () => {
    const { userRole } = useAuth();

    return (
        <>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={userRole ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <>
                                <Navbar />
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    } />

                    {/* Default Routes */}
                    <Route path="/" element={<Navigate to={userRole ? "/dashboard" : "/login"} />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default Router;
