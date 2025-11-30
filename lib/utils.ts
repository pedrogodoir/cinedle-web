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

// Data mínima do jogo (16 de setembro de 2025)
export const MIN_GAME_DATE = "2025-09-16";

/**
 * Retorna a data de hoje no formato YYYY-MM-DD baseada no horário LOCAL do usuário.
 */
export const getLocalToday = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Valida a data vinda da URL.
 * 1. Se for inválida/nula -> Retorna Hoje
 * 2. Se for formato errado -> Retorna Hoje
 * 3. Se for Futuro -> Retorna Hoje
 * 4. Se for antes do início do jogo -> Retorna Hoje 
 */
export const validateGameDate = (dateParam: string | undefined | string[]): string => {
  const today = getLocalToday();

  // Verifica se existe e se é string
  if (!dateParam || typeof dateParam !== 'string') {
    return today;
  }

  // Valida formato YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    return today;
  }

  // Verifica se é futuro 
  if (dateParam > today) {
    return today;
  }

  // Verifica data mínima
  if (dateParam < MIN_GAME_DATE) {
    return today; 
  }

  return dateParam;
};