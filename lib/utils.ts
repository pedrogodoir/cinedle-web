import { HistoryItem } from "@/lib/types/historyItem";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSameDay(day: Date, historyItem: HistoryItem): boolean {
  const itemDate = new Date(historyItem.date);
  return (
    day.getFullYear() === itemDate.getFullYear() &&
    day.getMonth() === itemDate.getMonth() &&
    day.getDate() === itemDate.getDate()
  );
}
export function leftJoinDiffUnique(
  vetor1: string[],
  vetor2: string[]
): string[] {
  const set2 = new Set(vetor2);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of vetor1) {
    if (!set2.has(item) && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}
export function extractYear(dateString: string): number {
  const date = new Date(dateString);
  return date.getFullYear();
}
