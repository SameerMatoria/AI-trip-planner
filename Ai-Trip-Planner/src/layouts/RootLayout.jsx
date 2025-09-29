import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/custom/Header.jsx"; // adjust path if no alias
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <>
      <Header />
      <Toaster />
      <Outlet />
    </>
  );
}
