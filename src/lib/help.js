import Sidebar from "@/components/sidebar";
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";

interface Props { 
    children: React.ReactNode;
}

const SidebarLayout = ({ children }: Props) => {
    return (
        <main className="flex h-screen overflow-hidden">
            <Sidebar />
            
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 h-full w-full">
                <LightRays />
                <Particles />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-20 p-4 overflow-auto">
                {children}
            </div>
        </main>
    );
};

export default SidebarLayout;