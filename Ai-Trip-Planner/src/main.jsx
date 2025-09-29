import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RootLayout from "./layouts/RootLayout.jsx";
import CreateTrip from "./create-trip/index.jsx";
import Viewtrip from "./view-trip/[tripId]/index.jsx";
import Dashboard from "./dashboard/index.jsx";
import "./index.css";
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,         // <-- Header lives here
    children: [
      { path: "/", element: <App /> },
      { path: "/create-trip", element: <CreateTrip /> },
      { path: "/view-trip/:tripId", element: <Viewtrip /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
