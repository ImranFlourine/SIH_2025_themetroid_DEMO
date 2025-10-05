"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { attemptFetchMe } from "@/services/apiTicket";

const User = {
  user: {
    id: "u12345",
    name: "Priyanshu Singh",
    email: "priyanshu.singh@powergrid.com",
    employeeId: "EMP56789",
    department: "IT",
    designation: "Software Engineer",
    role: "employee",
    avatarUrl: "https://example.com/profile/u12345.png",
    contact: {
      phone: "+91-9876543210",
      location: "New Delhi, India",
    },
  },
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(window.localStorage.getItem("isLoggedIn") || false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const result = await attemptFetchMe();
        if (result.status === "success") {
          console.log("Usser Fetched successfully");
          setCurrentUser(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
}
