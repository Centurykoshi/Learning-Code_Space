import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";
import Sidebar from "@/components/sidebar";
import { ChatSidebar } from "@/ChatbotComponents/ChatSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/ChatbotComponents/AppHeader";

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* First Sidebar */}
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="">

        {/* ChatSidebar and main content wrapped in SidebarProvider */}
        <SidebarProvider >
          <div className="flex ">
            {/* ChatSidebar */}
            <ChatSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              <AppHeader />

              {/* Background elements */}
              <div className="absolute opacity-100 pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000">
                <LightRays className="bg-transparent" />
              </div>
              <div className="absolute pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000">
                <Particles
                  className="bg-transparent"
                  particleCount={400}
                  particleBaseSize={30}
                />
              </div>

              <main className="flex-1">{children}</main>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden fixed top-4 left-4 z-30">
            <AppHeader />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}