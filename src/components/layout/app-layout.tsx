import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="p-6">
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </>
  );
}
