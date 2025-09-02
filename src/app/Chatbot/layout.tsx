
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";
import Sidebar from "@/components/sidebar";

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block  z-20">
        <Sidebar />
      </div>
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

      {/* Main content - where the actual chat pages will render */}
      <main className="flex-1">{children}</main>

      {/* Mobile Menu Button (optional) */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        {/* Add a hamburger menu button here if you want mobile sidebar access */}
        {/* <button className="p-2 bg-background border rounded-md">
          <Menu className="h-6 w-6" />
        </button> */}
      </div>
    </div>
  );
}