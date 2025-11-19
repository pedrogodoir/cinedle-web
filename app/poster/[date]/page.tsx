"use client";
import { Header } from "@/components/ui/header";
import { History } from "@/components/ui/history";
import { Modal } from "@/components/ui/Modal";
import { HistoryItem } from "@/lib/types/historyItem";
import { getColorBlind, getHistoryPoster, getLoseHistoryPoster, getGrayFilter} from "@/lib/useLocalstorage";
import axios from "axios";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClassicTable from "./poster/poster";
import WinScreenPoster from "./winScreen/winScreenPoster";
import GameOverScreenPoster from "./gameOverScreen/gameOverScreen";
import Poster from "./poster/poster";

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
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [colorBlind, setColorBlind] = useState(getColorBlind());
  const [grayFilter, setGrayFilter] = useState(getGrayFilter());

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
  const winHistory = getHistoryPoster();
  const loseHistory = getLoseHistoryPoster();
  const h = winHistory.find((item) => item.date.split("T")[0] === date);
  const h2 = loseHistory.find((item) => item.date.split("T")[0] === date);
  
  return (
    <div className="flex flex-col items-center justify-items-center bg-black ">
      <div className="bg-[url(/bg-classic.webp)] bg-center bg-cover bg-no-repeat w-full min-h-screen bg-black flex flex-col items-center justify-start px-4">
        <header className="w-screen md:w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
          <div></div>          <Header />
          <div className="flex items-center justify-center gap-4 max-[500px]:gap-2 ">
            <History date={date} currentMode="poster" />
            <Menu
              className="bg-white text-black rounded-full p-2 hover:bg-red-500 transition-colors cursor-pointer w-10 h-10 max-[500px]:w-8 max-[500px]:h-8 max-[350px]:h-6 max-[350px]:w-6"
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
          grayFilter={grayFilter}
          setGrayFilter={setGrayFilter}
          setColorBlind={setColorBlind}
        />

        {dateExistsInHistory({ date, history: winHistory }) ? (
          <WinScreenPoster movieId={h?.id} totalAttempts={h?.totalAttempts} />

        ) : dateExistsInHistory({ date, history: loseHistory }) ? (
          <GameOverScreenPoster movieId={h2?.id} totalAttempts={h2?.totalAttempts}
          />
        ) : (
          <Poster date={date} colorBlind={colorBlind} grayFilter={grayFilter}/>
        )}
      </div>
    </div>
  );
}
