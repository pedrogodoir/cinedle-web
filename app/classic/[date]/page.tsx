"use client";
import { HistoryItem } from "@/lib/types/historyItem";
import { getColorBlind, getHistory } from "@/lib/useLocalstorage";
import ClassicTable from "./table/classicTable";
import React, { use, useEffect, useRef, useState } from "react";
import WinScreenClassic from "./winScreen/winScreenClassic";
import axios from "axios";
import { History } from "@/components/ui/history";
import { IoSettingsOutline } from "react-icons/io5";
import { Modal } from "@/app/components/modal/Modal";

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
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-size-[100vw] bg-no-repeat">
      <header className="relative w-full py-4 flex items-center  justify-center text-white text-5xl font-extrabold px-4">
        <p className="z-10">Cinedle</p>
        <div className="flex items-center justify-center absolute right-100 gap-4 top-1/2 -translate-y-1/2">
          <History />
          <IoSettingsOutline
            size={40}
            className="bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
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
