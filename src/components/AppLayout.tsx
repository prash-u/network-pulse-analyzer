import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span>Translational network intelligence workspace</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <InstallButton />
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/docs">Docs</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Link to="/workspace">Launch workspace</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
