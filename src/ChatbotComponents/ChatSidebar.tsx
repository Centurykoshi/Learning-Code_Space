"use client";

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookDashed, ChevronDown, Home, MessageCircle, PenIcon, Trash2, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "About", url: "/About", icon: BookDashed },
];

export function ChatSidebar() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const session = authClient.useSession();
    const router = useRouter();
    const [isConversationsOpen, setIsConversationsOpen] = useState(true);

    const { data: conversations = [], isLoading, error } = useQuery(
        trpc.chatbot.getUserConversations.queryOptions());

    const deleteConversation = useMutation(trpc.chatbot.deleteConversation.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["chatbot", "getUserConversations"]]
            });
        }
    }));

    const handleDeleteConversation = (conversationId: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
      
            deleteConversation.mutate({ conversationId });
     
    };

    const handleNewChat = () => {
        router.push("/Chatbot");
    };


    if (error) {
        console.error('Query error:', error);
    }

    if (session.isPending) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/Chatbot"
                        onClick={handleNewChat}
                        className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors"
                    >
                        <PenIcon className="w-5 h-5" />
                        <span>getOkay</span>
                    </Link>
                    <Button
                        onClick={handleNewChat}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        New
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4 py-4 space-y-4">
                {/* Navigation Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="w-full rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                                            <item.icon className="w-4 h-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Conversations Section */}
                <Collapsible open={isConversationsOpen} onOpenChange={setIsConversationsOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors group">
                                Your Conversations
                                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent className="space-y-1">
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {isLoading ? (
                                        <div className="space-y-2 px-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 bg-muted/50 rounded-lg animate-pulse"
                                                />
                                            ))}
                                        </div>
                                    ) : error ? (
                                        <div className="px-3 py-2 text-sm text-destructive">
                                            Error loading conversations
                                        </div>
                                    ) : conversations && conversations.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto space-y-1 pr-2">
                                            <div className="conversation-scroll max-h-80 overflow-y-auto space-y-1">
                                                {conversations.map((conversation: any) => (
                                                    <SidebarMenuItem key={conversation.id}>
                                                        <div className="group relative">
                                                            <SidebarMenuButton asChild className="w-full">
                                                                <Link 
                                                                    href={`/Chatbot/chat/${conversation.id}`}
                                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                                                >
                                                                    <div className="flex-shrink-0 w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="truncate text-sm font-medium">
                                                                            {conversation.title || `Chat ${conversation.id.slice(0, 8)}`}
                                                                        </div>
                                                                        {conversation._count?.messages && (
                                                                            <div className="text-xs text-muted-foreground">
                                                                                {conversation._count.messages} messages
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            </SidebarMenuButton>
                                                            
                                                            {/* 3-dot menu */}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-accent transition-all z-10"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteConversation(conversation.id)}
                                                                        className="text-destructive focus:text-muted-foreground focus:bg-muted-foreground/10 rounded-xl"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete conversation
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </SidebarMenuItem>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-8 text-center">
                                            <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                                            <div className="text-sm text-muted-foreground mb-3">
                                                No conversations yet
                                            </div>
                                            <Button
                                                onClick={handleNewChat}
                                                size="sm"
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                Start your first chat
                                            </Button>
                                        </div>
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
        </Sidebar>
    );
}