"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
    refreshToken: "d2FzZGZhc2RmYXNkZg...",
    expiresAt: "2025-10-02T21:30:00Z",
  },
  preferences: {
    theme: "light",
    language: "en",
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
  },
  permissions: [
    "create_ticket",
    "view_ticket",
    "update_ticket",
    "chat_with_ai",
  ],
  lastLogin: "2025-10-01T20:15:00Z",
  session: {
    ip: "106.213.45.67",
    device: "Windows 11 - Chrome Browser",
  },
};

const page = () => {
  const { currentUser, setCurrentUser } = useUser();
  const router = useRouter();

  const logIn = () => {
    // login logic
    setCurrentUser(User);
    router.push("/dashboard");
  };

  useEffect(() => {
    // If already logged in, redirect to home
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="grid grid-cols-2 h-screen">
      <div>
        <img
          src="/assets/img/PowerGridSunset.jpg"
          alt="PowerGrid"
          className="h-full w-full object-left object-cover"
        />
      </div>
      <div className="flex justify-center items-center">
        <Card className={"w-sm gap-10 py-8"}>
          <CardHeader>
            <CardTitle
              className={
                "text-5xl font-extrabold text-secondary-foreground mb-1"
              }
            >
              Login
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Please enter your PowerGrid credentials
            </CardDescription>
          </CardHeader>

          <CardContent className={"flex flex-col gap-6"}>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input type="email" placeholder="Email" id="email" className="" />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Password"
                id="password"
                className=""
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button className={"w-full cursor-pointer"} onClick={logIn}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default page;
