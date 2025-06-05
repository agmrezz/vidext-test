import { TRPCCustomProvider } from "@/lib/trpc/client";
import { SidebarProvider } from "./ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCCustomProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TRPCCustomProvider>
  );
}
