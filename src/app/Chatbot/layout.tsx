import ChatbotForm from "@/ChatbotComponents/ChatGem";
import Sidebar from "@/components/sidebar";

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex z-20 min-h-screen">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* ChatbotForm Container */}
      <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 
                      md:left-20 md:mb-20 
                      lg:left-20 lg:mb-20">
        <div className="w-full h-full 
                        max-w-sm max-h-[90vh] 
                        sm:max-w-md sm:max-h-[92vh] 
                        md:max-w-2xl md:max-h-[95vh] 
                        lg:max-w-4xl lg:max-h-[95vh]">
          <ChatbotForm />
        </div>
      </div>
      
      {/* Main content - hidden behind chatbot */}
      <main className="flex-1 overflow-hidden -z-30">{children}</main>
      
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