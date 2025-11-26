"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getHistoryClassic, getPosterHistory, getLoseHistoryPoster } from "@/lib/useLocalstorage";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendarHistory";

const firstDay = new Date("2025-10-10");

interface HistoryProps {
  date: string;
  currentMode?: "classic" | "poster";

}

export function History({ date, currentMode = "classic"}: HistoryProps) {
  // Carrega apenas o histórico do modo atual
  const history = currentMode === "classic" ? getHistoryClassic() : getPosterHistory();
  
  const LoseHistoryPoster = getLoseHistoryPoster();
  

  // Converte a string de data para objeto Date
  const selectedDate = new Date(date + "T00:00:00");

  return (
    <div>
      <Dialog>
        <DialogTrigger
          className="h-full rounded-full flex justify-between items-center cursor-pointer py-2 px-1"
          asChild
        >
          <Button variant="default">
            <CalendarIcon className="hover:bg-gray-200 transition-colors w-6 h-6 max-[500px]:w-4 max-[500px]:h-4 max-[350px]:h-2 max-[350px]:w-2" />
          </Button>
        </DialogTrigger>        <DialogContent className="sm:max-w-[425px] bg-zinc-950 rounded-md p-4 border-3 border-zinc-700">
          <DialogHeader>
            <DialogTitle>
              History - {currentMode === "classic" ? "Classic Mode" : "Poster Mode"}
            </DialogTitle>
          </DialogHeader>

          <div className="body">
            <Calendar
              mode="single"
              selected={selectedDate}
              data={history}
              currentMode={currentMode}
              className="w-full min-h-[450px]"
              disabled={(date) => date > new Date() || date < firstDay}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
