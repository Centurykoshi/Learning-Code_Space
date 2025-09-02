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

    return <ChatbotForm chat={chat} conversationId={ConversationId} />
}

export default ChatPage;