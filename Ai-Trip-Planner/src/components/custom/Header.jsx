import React from "react";
import { Link } from "react-router-dom";
import useGoogleAuth from "@/service/useGoogleAuth";

function Header() {
  const { user, isLoading, signIn, signOut } = useGoogleAuth();

  return (
    <div className="p-4 shadow-md flex justify-between items-center">
      <a href="/" aria-label="Home">
        <img src="/logo.svg" alt="AI Trip Planner" className="h-8" />
      </a>

      <div className="flex items-center gap-3">
        {user && (
          <Link
            to="/dashboard"
            className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
          >
            My Trips
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user?.picture}
              alt={user?.name}
              className="h-8 w-8 rounded-full border"
            />
            <span className="hidden sm:inline text-sm">
              {user?.name?.split(" ")[0]}
            </span>
            <button
              onClick={signOut}
              className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            disabled={isLoading}
            className="px-3 py-1 rounded bg-gray-900 text-white"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
