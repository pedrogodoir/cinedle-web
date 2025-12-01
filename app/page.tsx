"use client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Modal } from "@/components/ui/Modal";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // pega a data atual no formato yyyy-mm-dd e adiciona no caminho
  const hrefClassic = "/classic/" + new Date().toISOString().split("T")[0];
  const hrefPoster = "/poster/" + new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col items-center justify-items-center h-screen min-w-screen bg-black bg-[url(/bg.webp)] bg-cover bg-center bg-no-repeat">
      <header className="w-screen md:w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
        <div></div>

        <Header />

        <div className=" flex items-center justify-center gap-4 max-[500px]:justify-end">
          {/* <Menu
            className="bg-white text-black rounded-full p-2  hover:bg-red-500 transition-colors cursor-pointer w-10 h-10 max-[500px]:w-8 max-[500px]:h-8 max-[350px]:h-6 max-[350px]:w-6"
            onClick={() => setIsModalOpen(true)}
          /> */}
        </div>
      </header>

      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        colorBlind={false}
        grayFilter={false}
        setGrayFilter={() => {}}
        setColorBlind={() => {}}
      >
        <p></p>
      </Modal> */}
      <div className="flex items-center justify-items-center flex-1 gap-10 text-center max-[500px]:flex-col flex-row ">
        <Link
          href={hrefClassic}
          className="flex flex-col text-white items-start bg-red-500 h-72 w-56 rounded-4xl shadow-xl p-4 gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <h1 className="text-3xl font-extrabold">Classic</h1>
          <p className="text-left">
            Try to guess the movie using color-coded hints that show how close
            you are to the right details!
          </p>
        </Link>
        <Link
          href={hrefPoster}
          className="flex flex-col items-start bg-sky-500 h-72 w-56 rounded-4xl shadow-xl p-4 text-white gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <h1 className="text-3xl font-extrabold">Poster</h1>
          <p className="text-left">
            Guess the movie from the poster alone! Pay attention to colors,
            characters, objects, style, and typography, everything can be a
            clue. Good luck!
          </p>
        </Link>
      </div>
      <div className=" absolute bottom-10 ">
        <a
          href="https://forms.gle/FP2c2M96TheHE1Uu5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>Dê seu feedback!</Button>
        </a>
      </div>
    </div>
  );
}
