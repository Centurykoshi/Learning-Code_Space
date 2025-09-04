"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex items-center px-3 py-2 bg-transparent">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        className="hover:bg-accent"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex-1" />
      
      {/* Add other header content here */}
    </header>
  );
}