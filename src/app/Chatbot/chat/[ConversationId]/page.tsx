import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import ChatbotForm from "@/ChatbotComponents/ChatbotPage";

type Props = {
    params: {
        ConversationId: string;
    };
};

const ChatPage = async ({ params }: Props) => {
    const { ConversationId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return redirect("/");
    }

    const chat = await prisma.chatbotConversation.findUnique({
        where: {
            id: ConversationId,
            userId: session.user.id,
        },
        include: {
            messages: true
        }
    });

    if (!chat) {
        return redirect("/Chatbot");
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 
                          md:left-20 md:mb-20 
                          lg:left-20 lg:mb-20">
            <div className="w-full h-full 
                            max-w-sm max-h-[90vh] 
                            sm:max-w-md sm:max-h-[92vh] 
                            md:max-w-2xl md:max-h-[95vh] 
                            lg:max-w-4xl lg:max-h-[95vh]">
              <ChatbotForm chat={chat} conversationId={ConversationId} />
            </div>
          </div>
       
    );
        
}

export default ChatPage;
