"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Calendar,
  User,
  Ticket,
  RefreshCcw,
} from "lucide-react";
import TicketStatics from "../card/TicketStatics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Separator } from "../separator";
import { SearchX } from "lucide-react";
import TicketCard from "../card/TicketCard";

// Mock data for tickets
const mockTickets = [
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["wifi", "disconnecting", "network issue"],
    },
    category: "Network",
    description:
      "User reports that their Wi-Fi repeatedly disconnects. Troubleshooting steps including restarting router/modem, restarting device, checking for interference, and updating Wi-Fi drivers have been attempted without resolving the issue.",
    priority: "Medium",
    source: "Chatbot",
    status: "Open",
    subcategory: "Wireless Connectivity",
    tags: ["wifi", "disconnecting", "network issue", "troubleshooting failed"],
    title: "Persistent Wi-Fi Disconnection Issue",
    createdAt: "2025-10-04T08:30:00.000Z",
    assignedTo: {
      email: "john.doe@example.com",
      emp_id: "EMP101",
      name: "John Doe",
    },
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["password", "login", "reset"],
    },
    category: "Account",
    description:
      "User cannot log in to their account. Password reset attempts failed, and two-factor authentication is not working properly.",
    priority: "High",
    source: "Chatbot",
    status: "Open",
    subcategory: "Authentication",
    tags: ["password", "login", "2FA", "reset failed"],
    title: "Unable to Log In to Account",
    createdAt: "2025-10-04T09:15:00.000Z",
    assignedTo: {
      email: "jane.smith@example.com",
      emp_id: "EMP102",
      name: "Jane Smith",
    },
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["printer", "not printing", "error"],
    },
    category: "Hardware",
    description:
      "User reports that the office printer is showing an error and refuses to print documents.",
    priority: "Medium",
    source: "Chatbot",
    status: "Open",
    subcategory: "Printer Issues",
    tags: ["printer", "error", "printing failed"],
    title: "Office Printer Not Printing",
    createdAt: "2025-10-04T10:00:00.000Z",
    assignedTo: {
      email: "alan.brown@example.com",
      emp_id: "EMP103",
      name: "Alan Brown",
    },
  },
  {
    aiAnalysis: {
      sentiment: "neutral",
      keywords: ["software", "installation", "update"],
    },
    category: "Software",
    description:
      "User requests installation of the latest version of the company-approved software on their workstation.",
    priority: "Low",
    source: "Chatbot",
    status: "Open",
    subcategory: "Software Installation",
    tags: ["software", "installation", "update"],
    title: "Request for Software Installation",
    createdAt: "2025-10-04T11:45:00.000Z",
    assignedTo: null,
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["laptop", "screen", "flickering"],
    },
    category: "Hardware",
    description:
      "User reports that their laptop screen is flickering intermittently. Possible display driver issue suspected.",
    priority: "High",
    source: "Chatbot",
    status: "Open",
    subcategory: "Display Issues",
    tags: ["laptop", "screen", "flickering"],
    title: "Laptop Screen Flickering",
    createdAt: "2025-10-04T12:30:00.000Z",
    assignedTo: {
      email: "susan.wilson@example.com",
      emp_id: "EMP104",
      name: "Susan Wilson",
    },
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["email", "not sending", "error"],
    },
    category: "Email",
    description:
      "User reports emails are not sending from Outlook and error code 0x80070005 appears.",
    priority: "High",
    source: "Chatbot",
    status: "Open",
    subcategory: "Email Sending",
    tags: ["email", "outlook", "error"],
    title: "Emails Not Sending from Outlook",
    createdAt: "2025-10-04T13:00:00.000Z",
    assignedTo: {
      email: "michael.lee@example.com",
      emp_id: "EMP105",
      name: "Michael Lee",
    },
  },
  {
    aiAnalysis: {
      sentiment: "neutral",
      keywords: ["vpn", "connectivity", "remote access"],
    },
    category: "Network",
    description:
      "User requests assistance setting up VPN access for remote work. VPN client installed but connection is intermittent.",
    priority: "Medium",
    source: "Chatbot",
    status: "Open",
    subcategory: "VPN Issues",
    tags: ["vpn", "remote access", "connectivity"],
    title: "VPN Connectivity Problems",
    createdAt: "2025-10-04T14:20:00.000Z",
    assignedTo: null,
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["monitor", "resolution", "display"],
    },
    category: "Hardware",
    description:
      "User reports that their external monitor is stuck at a low resolution and cannot change settings.",
    priority: "Medium",
    source: "Chatbot",
    status: "Open",
    subcategory: "Monitor Issues",
    tags: ["monitor", "resolution", "display"],
    title: "External Monitor Resolution Issue",
    createdAt: "2025-10-04T15:10:00.000Z",
    assignedTo: {
      email: "alan.brown@example.com",
      emp_id: "EMP103",
      name: "Alan Brown",
    },
  },
  {
    aiAnalysis: {
      sentiment: "negative",
      keywords: ["software", "crash", "error"],
    },
    category: "Software",
    description:
      "User reports that a critical software crashes immediately upon launch, preventing work.",
    priority: "High",
    source: "Chatbot",
    status: "Open",
    subcategory: "Software Crash",
    tags: ["software", "crash", "error"],
    title: "Critical Software Crash on Launch",
    createdAt: "2025-10-04T16:05:00.000Z",
    assignedTo: {
      email: "jane.smith@example.com",
      emp_id: "EMP102",
      name: "Jane Smith",
    },
  },
  {
    aiAnalysis: {
      sentiment: "neutral",
      keywords: ["backup", "data", "restore"],
    },
    category: "Data",
    description:
      "User requests assistance restoring a previous backup of their files after accidental deletion.",
    priority: "Medium",
    source: "Chatbot",
    status: "Open",
    subcategory: "Backup & Restore",
    tags: ["backup", "restore", "data"],
    title: "Data Restoration Request",
    createdAt: "2025-10-04T17:30:00.000Z",
    assignedTo: null,
  },
];
const statusConfig = {
  open: {
    icon: AlertCircle,
    color: "bg-blue-500",
    label: "Open",
    textColor: "text-blue-700",
  },
  "in-progress": {
    icon: Clock,
    color: "bg-yellow-500",
    label: "In Progress",
    textColor: "text-yellow-700",
  },
  resolved: {
    icon: CheckCircle,
    color: "bg-green-500",
    label: "Resolved",
    textColor: "text-green-700",
  },
  closed: {
    icon: XCircle,
    color: "bg-gray-500",
    label: "Closed",
    textColor: "text-gray-700",
  },
};

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800", label: "High" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  low: { color: "bg-green-100 text-green-800", label: "Low" },
};

const MyTickets = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = mockTickets.length;
    const open = mockTickets.filter(
      (ticket) => ticket.status === "open"
    ).length;
    const inProgress = mockTickets.filter(
      (ticket) => ticket.status === "in-progress"
    ).length;
    const resolved = mockTickets.filter(
      (ticket) => ticket.status === "resolved"
    ).length;
    const closed = mockTickets.filter(
      (ticket) => ticket.status === "closed"
    ).length;
    const active = open + inProgress;

    return { total, open, inProgress, resolved, closed, active };
  }, []);

  // Filter tickets based on search and filters
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  // I also noticed a small bug in your search logic. The mock tickets don't have an `id` field,
  // which would cause a crash. I've removed that part of the condition.
  if (filteredTickets[0] && !filteredTickets[0].id) {
    // This is just a placeholder to show the logic was considered.
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-primary">
            Hello {currentUser.user.name},
          </h1>
          <p className="text-muted-foreground text-lg">
            Here is what is happening with your tickets
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 2xl:grid-cols-4">
        <TicketStatics
          label={"Total tickets"}
          value={statistics.total}
          icon={Ticket}
        />

        <TicketStatics
          label={"Active tickets"}
          value={statistics.active}
          icon={RefreshCcw}
          color={"blue"}
        />

        <TicketStatics
          label={"In progress"}
          value={statistics.inProgress}
          icon={Clock}
          color={"yellow"}
        />

        <TicketStatics
          label={"Resolved"}
          value={statistics.resolved}
          icon={CheckCircle}
          color={"green"}
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 grid-rows-2 gap-x-5 items-center">
            <Label htmlFor="search" className={"text-lg"}>
              Search
            </Label>
            <Label htmlFor="status" className={"text-lg"}>
              Status
            </Label>
            <Label htmlFor="priority" className={"text-lg"}>
              Priority
            </Label>
            <div></div>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value)}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priorities</SelectLabel>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className={"flex-1 h-full"} onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4 mt-12">
        <div className="space-x-2">
          <span className="text-3xl font-semibold text-chart-3">
            Tickets ({filteredTickets.length})
          </span>
          <Separator className={"mt-2"} />
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <SearchX className="h-16 w-16 text-muted-foreground mb-4 opacity-70" />
            <h3 className="text-2xl text-muted-foreground font-semibold mb-2">
              No tickets found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.title} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
