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
import { useState } from "react";
import { Calendar } from "./calendarHistory";

const firstDay = new Date("2025-10-10");

export function History() {
  const history = getHistory();
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <CalendarIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
            <DialogDescription>View past games here.</DialogDescription>
          </DialogHeader>
          <div className="body">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
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
