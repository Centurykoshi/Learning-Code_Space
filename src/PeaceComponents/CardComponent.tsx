import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface CardComponentProps {
    onMarkNowClick?: () => void;
}

export default function CardComponent({ onMarkNowClick }: CardComponentProps) {

    const session = authClient.useSession();
    if (session.isPending) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }




    return (
        <div>
            <Card className="bg-transparent border-none">
                <CardHeader>
                    <CardTitle>How do you feel, {session?.data?.user.name || "Dear"} </CardTitle>
                    <CardDescription>Please, Mark your Mood Here </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="rounded-xl" onClick={onMarkNowClick}>Mark now</Button>
                </CardContent>
            </Card>
        </div>
    )
}