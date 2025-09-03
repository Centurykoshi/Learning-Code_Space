"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BookDashed, Home, MessageCircle } from "lucide-react";
import { Session, User } from "better-auth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const items = [
    { title: "Create New Chat", url: "/Chatbot", icon: MessageCircle },
    { title: "Home", url: "/", icon: Home },
    { title: "About", url: "/About", icon: BookDashed },
];

export function ChatSidebar({ session }: { session?: { session: Session; user: User } }) {
    const router = useRouter();
    const currentPath = usePathname();

    return (
        <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border/80">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-0.5">
                        <SidebarMenuButton asChild className="hover:bg-transparent">
                            <Link href="/Chatbot">
                                <h4 className="font-medium">Build Better</h4>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="mt-2 overflow-hidden relative">
                <div className="flex flex-col overflow-y-auto p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Hello There {session?.user?.name || session?.user?.id || "guest"}
                    </p>
                    
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}