"use client";
import Link from "next/link";
import { Modal } from "./components/modal/Modal";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // pega a data atual no formato yyyy-mm-dd e adiciona no caminho
  const hrefClassic = "/classic/" + new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg.png)] bg-cover bg-center">
      <header className="relative w-full py-4">
        <p className="text-white text-2xl font-bold text-center">Cinedle</p>

        <IoSettingsOutline
          size={40}
          className="absolute right-140 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </header>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        colorBlind={false}
        setColorBlind={() => {}}
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
