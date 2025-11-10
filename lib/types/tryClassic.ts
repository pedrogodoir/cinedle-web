import { Guess } from "./movieGuess";

/**
 * Represents an item in the user's history. SOMENTE VITÓRIAS
 */
export type TryClassic = {
  id: number;
  date: string;
  try: Guess[];
};
