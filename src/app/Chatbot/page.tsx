
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";
import ChatbotForm from "@/ChatbotComponents/ChatbotPage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function chatbot() {

  const session = await auth.api.getSession({
    headers : await headers(), 
  }); 

  if(!session?.user){ 
    return redirect("/sign-in")
  }

  return (
    <div className="min-h-screen min-w-screen relative overflow-hidden">

      {/* <div className="absolute opacity-100 pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000">
        <LightRays className="bg-transparent" />
      </div>
      <div className="absolute pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000">
        <Particles
          className="bg-transparent"
          particleCount={400}
          particleBaseSize={30}
        />
      </div> */}
           <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 
                              md:left-20 md:mb-20 
                              lg:left-20 lg:mb-20">
                <div className="w-full h-full 
                                max-w-sm max-h-[90vh] 
                                sm:max-w-md sm:max-h-[92vh] 
                                md:max-w-2xl md:max-h-[95vh] 
                                lg:max-w-4xl lg:max-h-[95vh]">
                  <ChatbotForm  />
                </div>
              </div>
    </div>
  )
}