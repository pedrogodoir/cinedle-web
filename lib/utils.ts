import { HistoryItem } from "@/lib/types/historyItem";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSameDay(day: Date, historyItem: HistoryItem): boolean {
  const itemDate = new Date(historyItem.date);
  return (
    day.getFullYear() === itemDate.getFullYear() &&
    day.getMonth() === itemDate.getMonth() &&
    day.getDate() === itemDate.getDate()
  );
}