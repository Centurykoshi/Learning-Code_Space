"use client";


import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthClient } from "better-auth/react";
import { BookDashed, Home, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";





const items = [
    { title: "Create New Chat", url: "/Chatbot", icon: MessageCircle },
    { title: "Home", url: "/", icon: Home },
    { title: "About", url: "/About", icon: BookDashed },
];


export function ChatSidebar() {
    const trpc = useTRPC(); 
    const queryClient = useQueryClient(); 

   

    

 

    // const trpc = useTRPC(); 

    const session = authClient.useSession();

 

    const {data : conversations, isLoading} = useQuery(trpc.chatbot.getUserConversations.queryOptions()); 

    const deleteConversation = useMutation(trpc.chatbot.deleteConversation.mutationOptions({
        onSuccess : ()=>{ 
            queryClient.invalidateQueries({
                queryKey : [["chatbot", "getUserConversations"]]
            })
        }
    }))

      const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteConversation.mutate({ conversationId });
    };


       if(session.isPending){ 
        return <div>Loading...</div>;

    }
    



    return (
           <div className="">
               <Sidebar collapsible="offcanvas" className="border-r bg-transparent">
                   <SidebarHeader>
                       <SidebarMenu>
                           <SidebarMenuItem className="flex items-center gap-0.5">
                               <SidebarMenuButton asChild>
                                   <Link href="/Chatbot" className="flex items-center gap-2">
                                       <MessageCircle className="h-4 w-4" />
                                       <span className="font-medium">Chatbot</span>
                                   </Link>
                               </SidebarMenuButton>
                           </SidebarMenuItem>
                       </SidebarMenu>
                   </SidebarHeader>
   
                   <SidebarContent className="mt-2 overflow-hidden relative">
                       <div className="flex flex-col overflow-y-auto p-4">
                           <p className="text-sm text-muted-foreground mb-4">
                               Hello There {session?.data?.user.name || session?.data?.user.id || "guest"}
                           </p>
   
                           {/* Navigation Items */}
                           <SidebarMenu>
                               {items.map((item) => (
                                   <SidebarMenuItem key={item.title}>
                                       <SidebarMenuButton asChild>
                                           <Link href={item.url} className="flex items-center gap-2">
                                               <item.icon className="h-4 w-4" />
                                               <span>{item.title}</span>
                                           </Link>
                                       </SidebarMenuButton>
                                   </SidebarMenuItem>
                               ))}
                           </SidebarMenu>
   
                           {/* Conversations Section */}
                           <div className="mt-6">
                               <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                   Recent Conversations
                               </h3>
                               
                               {isLoading ? (
                                   <div className="space-y-2">
                                       {[...Array(3)].map((_, i) => (
                                           <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                                       ))}
                                   </div>
                               ) : conversations && conversations.length > 0 ? (
                                   <SidebarMenu>
                                       {conversations.slice(0, 10).map((conversation) => (
                                           <SidebarMenuItem key={conversation.id}>
                                               <SidebarMenuButton asChild className="group">
                                                   <Link 
                                                       href={`/Chatbot?conversationId=${conversation.id}`}
                                                       className="flex items-center justify-between w-full"
                                                   >
                                                       <div className="flex items-center gap-2 flex-1 min-w-0">
                                                           <MessageCircle className="h-3 w-3 flex-shrink-0" />
                                                           <span className="truncate text-sm">
                                                               {conversation.title || `Chat ${conversation.id.slice(0, 8)}`}
                                                           </span>
                                                       </div>
                                                       <Button
                                                           variant="ghost"
                                                           size="sm"
                                                           className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                                           onClick={(e) => handleDeleteConversation(conversation.id, e)}
                                                       >
                                                           <Trash2 className="h-3 w-3" />
                                                       </Button>
                                                   </Link>
                                               </SidebarMenuButton>
                                           </SidebarMenuItem>
                                       ))}
                                   </SidebarMenu>
                               ) : (
                                   <p className="text-xs text-muted-foreground">
                                       No conversations yet. Start a new chat!
                                   </p>
                               )}
                           </div>
                       </div>
                   </SidebarContent>
               </Sidebar>
           </div>
       );
   }