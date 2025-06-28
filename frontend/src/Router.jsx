import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./auth/AuthContext";

// Lazy load components
const Login = lazy(() => import("./auth/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const STCMain = lazy(() => import("./STC/form/STCMain"));
const HomePageSTC = lazy(() => import("./stcManagement/HomePageSTC"));
const FeedMark = lazy(() => import("./stcManagement/FeedMark"));
const TraineeProfile = lazy(() => import("./stcManagement/TraineeProfile"));
const LineTraining = lazy(() => import("./stcManagement/LineTraining"));
const Marksheet = lazy(() => import("./stcManagement/Marksheet"));
const ManageCandidate = lazy(() => import("./stcManagement/ManageCandidate"));
// Protected route wrapper
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { userRole, hasPermission } = useAuth();

  if (!userRole) return <Navigate to="/login" replace />;
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout wrapper for protected routes
const ProtectedLayout = ({ children, requiredPermission }) => (
  <ProtectedRoute requiredPermission={requiredPermission}>
    <>
      <Navbar />
      {children}
    </>
  </ProtectedRoute>
);

const Router = () => {
  const { userRole } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={userRole ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* STC Form Route */}
        <Route
          path="/stc-form"
          element={
            <ProtectedLayout>
              <STCMain />
            </ProtectedLayout>
          }
        />

        <Route
          path="/manage-candidate"
          element={
            <ProtectedLayout>
              <ManageCandidate />
            </ProtectedLayout>
          }
        />

        {/* STC Management Homepage */}
        <Route
          path="/stc-management"
          element={
            // <ProtectedLayout>
            <HomePageSTC />
            // </ProtectedLayout>
          }
        />

        {/* STC Management Components - Only 4 components as per image */}
        <Route
          path="/stc/feed-marks"
          element={
            // <ProtectedLayout>
              <FeedMark />
            // </ProtectedLayout>
          }
        />

        <Route
          path="/stc/trainee-profile"
          element={
            // <ProtectedLayout>
              <TraineeProfile />
            // </ProtectedLayout>
          }
        />

        <Route
          path="/stc/line-training"
          element={
            // <ProtectedLayout>
              <LineTraining />
            // </ProtectedLayout>
          }
        />

        <Route
          path="/stc/marksheet"
          element={
            // <ProtectedLayout>
              <Marksheet />
            // </ProtectedLayout>
          }
        />

        {/* Default Routes */}
        <Route
          path="/"
          element={<Navigate to={userRole ? "/dashboard" : "/login"} replace />}
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
