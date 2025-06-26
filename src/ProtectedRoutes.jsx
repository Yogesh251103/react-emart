// ProtectedRoutes.js
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "./atoms/sampleAtom";

const ProtectedRoutes = ({ allowedRoles = [] }) => {
  const [auth, setAuth] = useRecoilState(authAtom);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");
    if (adminToken && !auth.tokenAdmin) {
      setAuth((prev) => ({
        ...prev,
        tokenAdmin: adminToken,
        isLoggedIn: true,
      }));
    }

    if (vendorToken && !auth.tokenVendor) {
      setAuth((prev) => ({
        ...prev,
        tokenVendor: vendorToken,
        isLoggedIn: true,
      }));
    }

    if (!adminToken && !vendorToken && auth.isLoggedIn) {
      setAuth((prev) => ({
        ...prev,
        isLoggedIn: false,
        tokenAdmin: "",
        tokenVendor: "",
        userName: "",
        password: "",
      }));
    }
  }, []);

  const isAuthenticated = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    // Check if user has required role and valid token
    if (allowedRoles.includes("admin")) {
      return adminToken && adminToken.trim() !== "" && auth.tokenAdmin;
    }

    if (allowedRoles.includes("vendor")) {
      return vendorToken && vendorToken.trim() !== "" && auth.tokenVendor;
    }

    // If no specific role required, check if any token exists
    return (adminToken || vendorToken) && auth.isLoggedIn;
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    if (allowedRoles.includes("vendor")) {
      return <Navigate to="/login" replace />;
    }

    // fallback if role is unknown or missing
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoutes;
