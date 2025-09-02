
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";
import ChatbotForm from "@/ChatbotComponents/ChatbotPage";

export default function chatbot() {

  return (
    <div className="min-h-screen min-w-screen relative overflow-hidden">

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
      <div className="fixed inset-0 flex justify-center items-center mb-20 left-20 p-4">
        <div className="w-full max-w-4xl h-full max-h-[95vh]">
          <ChatbotForm />
        </div>
      </div>
    </div>
  )
}