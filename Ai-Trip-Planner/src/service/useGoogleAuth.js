import { useCallback, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LS_KEY = "user";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY));
  } catch {
    return null;
  }
};

export default function useGoogleAuth() {
  const [user, setUser] = useState(readUser());
  const [isLoading, setIsLoading] = useState(false);

  const persist = (u) => {
    if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
    else localStorage.removeItem(LS_KEY);
    setUser(u || null);
  };

  const fetchProfile = async (access_token) => {
    const resp = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    return resp.data; // { email, name, picture, ... }
  };

  const doLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setIsLoading(true);
      try {
        const profile = await fetchProfile(access_token);
        persist(profile);
        return profile;
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setIsLoading(false);
      throw new Error("Google sign-in failed");
    },
  });

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      // triggers Google OAuth popup; resolves via onSuccess
      const profile = await doLogin();
      return profile;
    } finally {
      setIsLoading(false);
    }
  }, [doLogin]);

  const signOut = useCallback(() => {
    persist(null);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY) setUser(readUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, isLoading, signIn, signOut };
}
