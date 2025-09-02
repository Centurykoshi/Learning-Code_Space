
import Sidebar from "@/components/sidebar";

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex z-20 min-h-screen">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar />
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