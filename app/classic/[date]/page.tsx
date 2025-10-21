"use client";
import { HistoryItem } from "@/lib/types/historyItem";
import { getColorBlind, getHistory } from "@/lib/useLocalstorage";
import ClassicTable from "./table/classicTable";
import React, { use, useEffect, useRef, useState } from "react";
import WinScreenClassic from "./winScreen/winScreenClassic";
import axios from "axios";
import { History } from "@/components/ui/history";
import { IoSettingsOutline } from "react-icons/io5";
import { Modal } from "@/components/ui/Modal";
import { Menu } from "lucide-react";
import { Header } from "@/components/ui/header";

interface PageProps {
  params: { date: string };
}
type MovieResult = {
  id: string;
  title: string;
};

function dateExistsInHistory({
  date,
  history,
}: {
  date: string;
  history: HistoryItem[];
}): boolean {
  return history.some((item) => item.date.split("T")[0] === date);
}

export default function Page({ params }: PageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [colorBlind, setColorBlind] = useState(getColorBlind());

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }
    const handler = setTimeout(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `https://cinedle-backend.onrender.com/movies/summary/${search}`
          );
          console.log(res.data);
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
          setResults([]);
        }
      };
      fetchData();
    }, 250);

    return () => clearTimeout(handler);
  }, [search]);

  const { date } = use(params as unknown as Promise<PageProps["params"]>);
  const history = getHistory();

  const h = history.find((item) => item.date.split("T")[0] === date);
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.webp)] bg-size-[100vw] bg-no-repeat">
      <header className="w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
        <div></div>
        <Header />
        <div className="flex items-center justify-center gap-4">
          <History />
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
        colorBlind={colorBlind}
        setColorBlind={setColorBlind}
      />
      {dateExistsInHistory({ date, history }) ? (
        <WinScreenClassic movieId={h?.id} totalAttempts={h?.totalAttempts} />
      ) : (
        <ClassicTable date={date} colorBlind={colorBlind} />
      )}
    </div>
  );
}
