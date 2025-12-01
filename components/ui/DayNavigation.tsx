import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DayNavigationProps {
  currentDate: string; // formato "yyyy-mm-dd"
  currentMode: "classic" | "poster";
}

// Data do primeiro jogo disponível
const FIRST_GAME_DATE = new Date("2025-10-10");

export function DayNavigation({ currentDate, currentMode }: DayNavigationProps) {
  const router = useRouter();

  // Converte a string de data para objeto Date
  const getCurrentDateObj = () => {
    const [year, month, day] = currentDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Verifica se existe um dia anterior válido
  const hasPreviousDay = () => {
    const current = getCurrentDateObj();
    const previous = new Date(current);
    previous.setDate(previous.getDate() - 1);

    return previous >= FIRST_GAME_DATE;
  };

  // Verifica se existe um próximo dia válido
  const hasNextDay = () => {
    const current = getCurrentDateObj();
    const next = new Date(current);
    next.setDate(next.getDate() + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return next <= today;
  };

  // Navega para o dia anterior
  const goToPreviousDay = () => {
    if (!hasPreviousDay()) return;

    const current = getCurrentDateObj();
    const previous = new Date(current);
    previous.setDate(previous.getDate() - 1);

    const dateStr = previous.toISOString().split("T")[0];
    router.push(`/${currentMode}/${dateStr}`);
  };

  // Navega para o próximo dia
  const goToNextDay = () => {
    if (!hasNextDay()) return;

    const current = getCurrentDateObj();
    const next = new Date(current);
    next.setDate(next.getDate() + 1);

    const dateStr = next.toISOString().split("T")[0];
    router.push(`/${currentMode}/${dateStr}`);
  }; return (
    <div className="flex items-center gap-2">
      {/* Previous Day Button */}
      <Button
        onClick={goToPreviousDay}
        disabled={!hasPreviousDay()}
        variant="ghost"
        className="bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-2 border-zinc-700 transition-all h-10 px-3 lg:px-4 md:px-3 max-md:w-10 max-md:px-0"
        title="Previous Day"
      >
        <ChevronLeft className="w-4 h-4 text-white md:w-5 md:h-5 max-md:w-6 max-md:h-6 md:hidden" />
        <span className=" text-white text-sm font-medium max-md:hidden">
          Previous Day
        </span>
      </Button>

      {/* Next Day Button */}
      <Button
        onClick={goToNextDay}
        disabled={!hasNextDay()}
        variant="ghost"
        className="bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-2 border-zinc-700 transition-all h-10 px-3 lg:px-4 md:px-3 max-md:w-10 max-md:px-0"
        title="Next Day"
      >
        <span className=" text-white text-sm font-medium max-md:hidden">
          Next Day
        </span>
        <ChevronRight className="w-4 h-4 text-white md:w-5 md:h-5 max-md:w-6 max-md:h-6 md:hidden" />
      </Button>
    </div>
  );
}
