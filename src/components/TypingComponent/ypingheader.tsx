import { LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";


export default function Typingheader() {
    return (
        <div className="fixed top-5 left-0 right-0 p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 sm:px-8 lg:px-20">
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-primary">getOkay</h1>
                    <div className="text-sm text-muted-foreground opacity-50">
                        Affirmation typing here hehe
                    </div>
                </div>

           
                <Button variant="ghost" size="icon">
                    <Link href="/dashboard">
                        <LayoutDashboard className="w-6 h-6" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}