
import Sidebar from "@/components/sidebar";

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex z-20 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
