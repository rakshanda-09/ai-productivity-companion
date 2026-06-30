import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
