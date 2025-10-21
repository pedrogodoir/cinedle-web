"use client";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { Header } from "@/components/ui/header";
import { Menu } from "lucide-react";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // pega a data atual no formato yyyy-mm-dd e adiciona no caminho
  const hrefClassic = "/classic/" + new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg.webp)] bg-cover bg-center">
      <header className="w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
        <div></div>
        <Header />
        <div className="flex items-center justify-center gap-4">
          <Menu
            size={40}
            className="bg-white text-black rounded-full p-2  hover:bg-red-500 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </header>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        colorBlind={false}
        setColorBlind={() => { }}
      >
        <p></p>
      </Modal>

      <div className="flex items-center justify-center flex-1 gap-10 text-center">
        <Link
          href={hrefClassic}
          className="flex flex-col text-white items-start bg-red-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <h1 className="text-3xl font-extrabold">Classico</h1>
          <p>lorem ipsum</p>
        </Link>

        <div className="flex flex-col items-start bg-sky-500 h-72 w-56 rounded-4xl shadow-xl p-4 text-white gap-2 cursor-pointer hover:scale-105 transition-transform">
          <h1 className="text-3xl font-extrabold">Poster</h1>
          <p>lorem ipsum</p>
        </div>
      </div>
    </div>
  );
}
