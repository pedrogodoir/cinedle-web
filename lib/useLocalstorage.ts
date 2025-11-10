import { HistoryItem } from "./types/historyItem";
import { Guess } from "./types/movieGuess";
import { TryClassic } from "./types/tryClassic";

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
export function getColorBlind(): boolean {
  if (typeof window === "undefined") {
    console.log("getColorBlind called on server side");
    return false;
  }
  return localStorage.getItem("colorBlind") === "true";
}
export function setColorBlind(value: boolean) {
  if (typeof window === "undefined") {
    console.log("setColorBlind called on server side");
    return;
  }
  localStorage.setItem("colorBlind", value ? "true" : "false");
}

export function appendTryClassic(item: Guess, date: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("tryClassic");
  const tryClassic: TryClassic[] = stored ? JSON.parse(stored) : [];

  // Procura se já existe um item com essa data
  const existingIndex = tryClassic.findIndex((tryItem) => tryItem.date === date);

  if (existingIndex !== -1) {
    // Se existir, adiciona o guess no array 'try' do item existente
    tryClassic[existingIndex].try.unshift(item);
  } else {
    // Se não existir, cria um novo
    tryClassic.unshift({
      id: tryClassic.length + 1,
      date: date,
      try: [item],
    });
  }

  localStorage.setItem("tryClassic", JSON.stringify(tryClassic));
}

export function getTryClassic(date: string): Guess[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("tryClassic");
  const tryClassic: TryClassic[] = stored ? JSON.parse(stored) : [];

  // Procura o item com a data especificada
  const dayTries = tryClassic.find((item) => item.date === date);

  // Retorna o array de guesses ou array vazio
  return dayTries ? dayTries.try : [];
}

export function clearTryClassic(date: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("tryClassic");
  const tryClassic: TryClassic[] = stored ? JSON.parse(stored) : [];

  // Remove o item com a data especificada
  const filteredTryClassic = tryClassic.filter((item) => item.date !== date);

  // Se não sobrou nenhum item, remove a chave do localStorage
  if (filteredTryClassic.length === 0) {
    localStorage.removeItem("tryClassic");
  } else {
    // Caso contrário, atualiza com os itens restantes
    localStorage.setItem("tryClassic", JSON.stringify(filteredTryClassic));
  }
}