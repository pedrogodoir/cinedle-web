/**
 * Represents an item in the user's history. SOMENTE VITÓRIAS
 */
export type HistoryItem = {
  id: number;
  date: string;
  totalAttempts?: number;
  mode?: "classic" | "poster"; // Qual modo foi jogado
  result: "win" | "lose"
};
