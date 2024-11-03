"use client";
import DraggableSquares from "@/components/DraggableSquares";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 relative">
        <DraggableSquares />
      </div>
    </div>
  );
}