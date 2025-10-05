import AppSidebar from "@/components/ui/menu/AppSidebar";
import Navbar from "@/components/ui/menu/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TabProvider } from "@/context/TabContext";

function layout({ children }) {
  return (
    <div>
      <TabProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <Navbar />
            <main className="py-3 px-16">{children}</main>
          </div>
        </SidebarProvider>
      </TabProvider>
    </div>
  );
}

export default layout;
