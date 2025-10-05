"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { currentUser, setCurrentUser } = useUser();
  const router = useRouter();

  const logOut = () => {
    // logout logic
    // clear user context
    setCurrentUser(null);
    router.push("/auth");
  };
  // redirect to login page

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser(null);
      router.push("/auth");
    }
  }, [currentUser, router]);

  return (
    <div>
      Hello {currentUser ? currentUser.user.name : "Guest"}
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
