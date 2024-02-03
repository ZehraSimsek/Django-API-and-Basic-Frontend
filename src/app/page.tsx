import React from "react";
import Sidebar from "../app/components/Sidebar"

export default function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center " style={{ background: 'linear-gradient(to right, #FFE5E5, #E0AED0, #AC87C5)' }}>
        <Sidebar />
    </main>
  );
}