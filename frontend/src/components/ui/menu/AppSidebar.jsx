"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "../separator";
import { Home, Inbox, Settings } from "lucide-react";
import { useTab } from "@/context/TabContext";

const navigation = [
  {
    title: "My Tickets",
    value: "my-tickets",
    icon: Home,
  },
  {
    title: "Chatbot",
    value: "chatbot",
    icon: Inbox,
  },
  {
    title: "Raise a ticket",
    value: "raise-ticket",
    icon: Inbox,
  },
  {
    title: "Analytics",
    value: "analytics",
    icon: Home,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { setCurrentTab } = useTab();

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className={"flex items-center justify-center p-2"}>
        <img
          src="/assets/img/PowerGridLogo.png"
          alt="PowerGrid Logo"
          className="w-[80%]"
        />
      </SidebarHeader>
      <Separator />
      {/* Main content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  onClick={() => handleTabChange(item.value)}
                >
                  <SidebarMenuButton asChild>
                    <div
                      key={item.title}
                      className="flex items-center gap-3 py-5 cursor-pointer"
                    >
                      <div>
                        <item.icon size={18} />
                      </div>
                      <span className="text-base font-extralight">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
