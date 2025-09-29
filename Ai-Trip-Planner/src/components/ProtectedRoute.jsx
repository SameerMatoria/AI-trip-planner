import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useGoogleAuth from "@/service/useGoogleAuth";

export default function ProtectedRoute({ children }) {
  const { user } = useGoogleAuth();
  const location = useLocation();
  if (!user?.email) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
}
