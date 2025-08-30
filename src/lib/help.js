"use client";
import { useEffect } from "react";
import { startLightRayAnimation } from "@/lib/lightRay"; // your JS animation file

export default function HomePage() {
  useEffect(() => {
    // call your JS function after mount
    startLightRayAnimation("lightCanvas");
  }, []);

  return (
    <main className="flex items-center justify-center h-screen bg-black">
      <canvas
        id="lightCanvas"
        width={1200}
        height={800}
        className="rounded-xl shadow-lg"
      />
    </main>
  );
}
