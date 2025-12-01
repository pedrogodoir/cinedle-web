"use client";
import { Header } from "@/components/ui/header";
import { History } from "@/components/ui/history";
import { RulesModal } from "@/components/ui/RulesModal";
import { HistoryItem } from "@/lib/types/historyItem";
import GrayFilterSwitch from "@/components/ui/GrayFilterSwitch"
import { DayNavigation } from "@/components/ui/DayNavigation";
import { getColorBlind, getPosterHistory, getLoseHistoryPoster, getGrayFilter } from "@/lib/useLocalstorage";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ClassicTable from "./poster/poster";
import WinScreenPoster from "./winScreen/winScreenPoster";
import GameOverScreenPoster from "./gameOverScreen/gameOverScreen";
import Poster from "./poster/poster";
import { validateGameDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const params = useParams<{ date: string }>();

  // Calcula a data correta
  const validatedDate = useMemo(() => {
    return validateGameDate(params.date);
  }, [params.date]);

  useEffect(() => {
    // Se a data que está na URL (params.date) for diferente da data validada (validatedDate)
    // Significa que a URL está "errada" e precisa ser corrigida.
    if (params.date !== validatedDate) {
      router.replace(`/poster/${validatedDate}`);
    }
  }, [params.date, validatedDate, router]);

  // Se estivermos prestes a redirecionar, retornar um loading
  if (params.date !== validatedDate) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
      </div>
    );
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const date = validatedDate;
  const posterHistory = getPosterHistory();
  const h = posterHistory.find((item) => item.date.split("T")[0] === date);

  if (dateExistsInHistory({ date, history: posterHistory }) && (h?.result == "win" || h?.result == "lose") && isModalOpen) setIsModalOpen(false)

  return (
    <div className="flex flex-col items-center justify-items-center bg-black ">
      <div className="bg-[url(/bg-classic.webp)] bg-center bg-cover bg-no-repeat w-full min-h-screen bg-black flex flex-col items-center justify-start px-4">        <header className="w-screen md:w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
        {/* Day Navigation */}
        <div className="flex items-center justify-center">
          <DayNavigation currentDate={date} currentMode="poster" />
        </div>

        <Header />        <div className="flex items-center justify-center gap-4 max-[500px]:gap-2 ">
          <History date={date} currentMode="poster" />
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-50 cursor-pointer text-black hover:bg-blue-500 transition-colors h-10 px-4 max-[500px]:px-3 max-[500px]:h-8"
          >
            <BookOpen className="w-5 h-5 max-[500px]:w-4 max-[500px]:h-4 mr-2 max-[500px]:mr-1" />
            <span className="font-semibold text-sm max-[500px]:text-xs">Rules</span>
          </Button>
        </div>
      </header>{/* {!dateExistsInHistory({ date, history: posterHistory }) ? (<GrayFilterSwitch grayFilter={grayFilter} setGrayFilter={setGrayFilter} />) : <></>} */}

        {/*  Rules Modal */}
        <RulesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="poster"
        />

        {dateExistsInHistory({ date, history: posterHistory }) && h?.result == "win" ? (

          <WinScreenPoster movieId={h?.id} totalAttempts={h?.totalAttempts} />

        ) : dateExistsInHistory({ date, history: posterHistory }) && h?.result == "lose" ? (
          <GameOverScreenPoster movieId={h?.id} totalAttempts={h?.totalAttempts}
          />
        ) : (
          <Poster date={date} />
        )}
      </div>
    </div>
  );
}
