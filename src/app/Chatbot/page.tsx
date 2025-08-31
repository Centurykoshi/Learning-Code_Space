
import { ChatbotForm } from "@/ChatbotComponents/chatbotform";
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";

export default function chatbot() {

  return (
    <div className="min-h-screen min-w-screen flex">

      <div className="absolute opacity-100 pointer-events-none top-0 left-0 w-full h-full z-10 fade-in animate-in duration-5000">
        <LightRays className="bg-transparent" />
      </div>
      <div className="absolute pointer-events-none top-0 left-0 w-full h-full z-10 fade-in animate-in duration-5000">
        <Particles
          className="bg-transparent"
          particleCount={400}
          particleBaseSize={30}
        />
      </div>
      <div className="fixed  flex justify-center items-end w-full h-screen left-20">
        <div className="max-w-[50vw] w-full sm:max-w-[45vw]  lg:max-w-[50vw] p-4 sm:p-2 mb-10">
          <ChatbotForm />
        </div>
      </div>
    </div>
  )
}