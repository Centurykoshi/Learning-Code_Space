import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";
import Sidebar from "@/components/sidebar";


export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            {/* First Sidebar */}
            <div className="z-10">
                <Sidebar />
            </div>





            {/* Background elements */}
            <div className="absolute opacity-100 pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000 overflow-hidden">
                <LightRays className="bg-transparent" />
            </div>
            <div className="absolute pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000 overflow-hidden">
                <Particles
                    className="bg-transparent"
                    particleCount={400}
                    particleBaseSize={30}
                />
            </div>

            <main className="flex flex-1 justify-center items-center">{children}</main>

        </div>



    );
}