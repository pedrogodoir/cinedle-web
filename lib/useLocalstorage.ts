import { HistoryItem } from "./types/historyItem";

/**
 * Adiciona um item no histórico do localStorage.
 * Cria o array se ainda não existir.
 */
export function appendHistoryItem(item: HistoryItem) {
  if (typeof window === "undefined") return; // garante que só rode no cliente

  // Pega o histórico atual
  const stored = localStorage.getItem("history");
  const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

  // Adiciona o novo item
  history.push(item);

  // Salva de volta como JSON
  localStorage.setItem("history", JSON.stringify(history));
}

/**
 * Lê todo o histórico
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    console.log("getHistory called on server side");
    return [];
  }

  const stored = localStorage.getItem("history");
  return stored ? JSON.parse(stored) : [];
}
