"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getHistory } from "@/lib/useLocalstorage";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendarHistory";

const firstDay = new Date("2025-10-10");

interface HistoryProps {
  date: string;
}

export function History({ date }: HistoryProps) {
  console.log(date);
  const history = getHistory();

  // Converte a string de data para um objeto Date no fuso horário local
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
  };

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
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950 rounded-md p-4 border-3 border-zinc-700">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
            <DialogDescription>View past games here.</DialogDescription>
          </DialogHeader>
          <div className="body">
            <Calendar
              mode="single"
              selected={parseLocalDate(date)} // Usa a função para converter corretamente
              data={history}
              //o min-h-450 é para evitar que o calendário mude de tamanho quando muda de mês
              className="w-full min-h-[450px]"
              disabled={(date) => date > new Date() || date < firstDay}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
