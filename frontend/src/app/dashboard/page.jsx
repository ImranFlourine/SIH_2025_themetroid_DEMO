"use client";

import { useTab } from "@/context/TabContext";
import {
  Analytics,
  Chatbot,
  MyTickets,
  RaiseTicket,
  Settings,
} from "@/components/ui/screen";

const tabs = {
  "my-tickets": MyTickets,
  chatbot: Chatbot,
  analytics: Analytics,
  "raise-ticket": RaiseTicket,
  settings: Settings,
};

const page = () => {
  const { currentTab } = useTab();
  const CurrentTabComponent = tabs[currentTab] || MyTickets;
  return (
    <div>
      <CurrentTabComponent />
    </div>
  );
};

export default page;
