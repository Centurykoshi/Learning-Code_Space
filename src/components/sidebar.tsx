import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";



import { Button } from "./ui/button";
import { Book, Gamepad, LayoutDashboard, MessageCircle, StarIcon, User } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAccountNav from "./UserAvatarNav";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import LightRays from "@/ChatbotComponents/LightRayComponent";



export default async function Sidebar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });



    // Query following your pattern









    // const logos = [
    //     { id: "chat", icon: <Image src="/chat.png" alt="Chat Logo" width={40} height={40} /> },
    //     { id: "games", icon: <Image src="/controller.png" alt="Games Logo" width={40} height={40} /> },


    // ]

    return (

        <div className="fixed flex flex-col left-0 w-20 h-screen rounded-tl-3xl rounded-bl-3xl bg-transparent">
            <div className="flex w-full h-[95vh] justify-center flex-col">

                <div className="transition-all duration-500 transform hover:rotate-180 cursor-pointer flex  justify-center ">
                    <Link href="/dashboard">
                    <StarIcon className="text-primary h-20 w-10" />
                    </Link>
                </div>

                <div className="flex flex-col w-full h-[60vh] items-center justify-center  gap-4">
                    <div className="flex justify-center items-center-safe h-10 w-10">
                        <Link href="/Chatbot">
                        <MessageCircle className="transition-all  duration-300 text-primary transform hover:rotate-360 cursor-pointer " />
                        </Link>
                    </div>
                    <div className="flex justify-center place-items-center-safe h-10 w-10">
                        <Gamepad className="transition-all  duration-300 text-primary transform hover:rotate-360 cursor-pointer hover:scale-125" />

                    </div>

                    <div className="flex justify-center place-items-center-safe  h-10 w-10">
                        <Book className="transition-all  duration-300 text-primary transform hover:rotate-360 cursor-pointer hover:scale-125" />

                    </div>
                    <div className="flex justify-center place-items-center-safe h-10 w-10">
                        <User className="transition-all  duration-300 text-primary transform hover:rotate-360 cursor-pointer " />

                    </div>

                </div>

                <div className="flex flex-col w-full h-[20vh] items-center justify-end mb-4 gap-4">
                    <div className="flex  justify-center items-end ">
                        <ThemeToggle className="h-10 w-10 " />
                    </div>
                    <div className="flex justify-center max-h-[10vh] items-end">
                        {session?.user && <UserAccountNav user={session.user} />}
                    </div>
                </div>
            </div>
            {/* content */}
        </div>

    )
}
