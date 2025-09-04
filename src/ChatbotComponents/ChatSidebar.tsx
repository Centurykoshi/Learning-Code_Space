
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { BookDashed, Home, MessageCircle } from "lucide-react";
import { headers } from "next/headers";




const items = [
    { title: "Create New Chat", url: "/Chatbot", icon: MessageCircle },
    { title: "Home", url: "/", icon: Home },
    { title: "About", url: "/About", icon: BookDashed },
];

export async function ChatSidebar() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="">
            <Sidebar collapsible="offcanvas" className="border-r bg-transparent" >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center gap-0.5">
                            <SidebarMenuButton asChild className="hover:bg-transparent">
                                <a href="/Chatbot">
                                    <h4 className="font-medium">Build Better</h4>
                                </a>
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
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </div>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}