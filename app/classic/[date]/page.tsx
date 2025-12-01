"use client";
import { Header } from "@/components/ui/header";
import { History } from "@/components/ui/history";
import { RulesModal } from "@/components/ui/RulesModal";
import { HistoryItem } from "@/lib/types/historyItem";
import { getColorBlind, getHistoryClassic } from "@/lib/useLocalstorage";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ClassicTable from "./table/classicTable";
import WinScreenClassic from "./winScreen/winScreenClassic";
import ColorBlindSwitch from "@/components/ui/ColorBlindSwitch";
import { DayNavigation } from "@/components/ui/DayNavigation";
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
      router.replace(`/classic/${validatedDate}`);
    }
  }, [params.date, validatedDate, router]);

  // Se estivermos prestes a redirecionar, retornar um loading
  if (params.date !== validatedDate) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-red-700 dark:border-gray-700 dark:border-t-red-600"></div>
      </div>
    );
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [colorBlind, setColorBlind] = useState(false);

  // Carrega o estado do colorBlind do localStorage
  useEffect(() => {
    setColorBlind(getColorBlind());
  }, []);

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
  const history = getHistoryClassic();
  const h = history.find((item) => item.date.split("T")[0] === date);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen min-w-screen bg-black bg-[url(/bg-classic.webp)] bg-center bg-cover bg-no-repeat">      <header className="w-screen md:w-2xl py-4 grid grid-cols-3 items-center gap-6 justify-end text-white text-5xl font-extrabold px-4">
      {/* Day Navigation */}
      <div className="flex items-center justify-start">
        <DayNavigation currentDate={date} currentMode="classic" />
      </div>

      <Header />      <div className="flex items-center justify-center gap-4 max-[500px]:gap-2">
        <History date={date} currentMode="classic" />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-zinc-50  cursor-pointer text-black hover:bg-red-500 transition-colors h-10 px-4 max-[500px]:px-3 max-[500px]:h-8"
        >
          <BookOpen className="w-5 h-5 max-[500px]:w-4 max-[500px]:h-4 mr-2 max-[500px]:mr-1" />
          <span className="font-semibold text-sm max-[500px]:text-xs">Rules</span>
        </Button>
      </div>
    </header>{/* ColorBlind Switch - só aparece se não tiver ganhado ainda */}
      {!dateExistsInHistory({ date, history }) && (
        <ColorBlindSwitch
          colorBlind={colorBlind}
          setColorBlind={setColorBlind}
        />
      )}

      <RulesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="classic"
        colorBlind={colorBlind}
      />

      {dateExistsInHistory({ date, history }) ? (
        <WinScreenClassic movieId={h?.id} totalAttempts={h?.totalAttempts} />
      ) : (
        <ClassicTable date={date} colorBlind={colorBlind} />
      )}
    </div>
  );
}
