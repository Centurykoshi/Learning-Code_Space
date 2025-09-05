"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookDashed, Home, MessageCircle } from "lucide-react";

const items = [
    { title: "Create New Chat", url: "/Chatbot", icon: MessageCircle },
    { title: "Home", url: "/", icon: Home },
    { title: "About", url: "/About", icon: BookDashed },
];

export function useTRPCutils() { 
    const queryClient = useQueryClient(); 
    const trpc = useTRPC(); 
    
    return { queryClient, trpc };
}

export function ChatSidebar() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const session = authClient.useSession();

    if (session.isPending) { 
        return <div>Loading...</div>;
    }

    const { data: conversations, isLoading } = useQuery(
        trpc.chatbot.getUserConversations.queryOptions()
    ); 

    const deleteConversation = useMutation({
        ...trpc.chatbot.deleteConversation.mutationOptions(),
        onSuccess: () => {
            // Option 1: If you have tRPC utils
            // trpc.chatbot.getUserConversations.invalidate();
            
            // Option 2: Manual invalidation with query key
            queryClient.invalidateQueries({
                queryKey: [['chatbot', 'getUserConversations']]
            });
            
            // Option 3: Invalidate all chatbot queries (broader approach)
            // queryClient.invalidateQueries({
            //     queryKey: [['chatbot']]
            // });
        }
    });

    return (
        <div className="">
            <Sidebar collapsible="offcanvas" className="border-r bg-transparent">
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
                    <div className="flex flex-col p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Hello There {session?.data?.user.name || session?.data?.user.id || "guest"}
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

                        {/* Display conversations if you want to show them in sidebar */}
                        {session.data?.user && (
                            <>
                                {isLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading conversations...</div>
                                ) : (
                                    conversations && conversations.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="text-sm font-medium mb-2">Recent Conversations</h5>
                                            {conversations.map((conversation) => (
                                                <div key={conversation.id} className="flex items-center justify-between py-1">
                                                    <span className="text-sm truncate">{conversation.title || `Chat ${conversation.id}`}</span>
                                                    <button
                                                        onClick={() => deleteConversation.mutate({ id: conversation.id })}
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                        disabled={deleteConversation.isPending}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}