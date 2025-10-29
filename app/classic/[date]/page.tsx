"use client";
import { Header } from "@/components/ui/header";
import { History } from "@/components/ui/history";
import { Modal } from "@/components/ui/Modal";
import { HistoryItem } from "@/lib/types/historyItem";
import { getColorBlind, getHistory } from "@/lib/useLocalstorage";
import axios from "axios";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClassicTable from "./table/classicTable";
import WinScreenClassic from "./winScreen/winScreenClassic";

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

export default function Page() {
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
            `${process.env.NEXT_PUBLIC_API_URL}/movies/summary/${search}`
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

  const date = useParams<{ date: string }>().date;
  const history = getHistory();

  const h = history.find((item) => item.date.split("T")[0] === date);
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.webp)] bg-size-[100vw] bg-no-repeat">
      <header className="w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
        <div></div>
        <Header />
        <div className="flex items-center justify-center gap-4">
          <History date={date}/>
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
