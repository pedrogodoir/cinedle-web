import { HistoryItem } from "./types/historyItem";
import { Guess } from "./types/movieGuess";
import { TryClassic } from "./types/tryClassic";
import { PosterTry } from "./types/posterTry";

// ============ HISTORY FUNCTIONS ============

/**
 * Adiciona um item no histórico do Classic
 */
export function appendHistoryClassic(item: HistoryItem) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("historyClassic");
  const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

  history.push(item);
  localStorage.setItem("historyClassic", JSON.stringify(history));
}

/**
 * Lê todo o histórico do Classic
 */
export function getHistoryClassic(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem("historyClassic");
  return stored ? JSON.parse(stored) : [];
}

/**
 * Adiciona um item no histórico do Poster
 */
export function appendHistoryPoster(item: HistoryItem) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("posterHistory");
  const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

  history.push(item);
  localStorage.setItem("posterHistory", JSON.stringify(history));
}


/**
 * Lê o histórico de derrota do Poster
 */
export function getLoseHistoryPoster(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem("posterHistory");
  const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

  return history.filter(item => item.result === "lose");
}

/**
 * Lê todo o histórico do Poster
 */
export function getPosterHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem("posterHistory");
  return stored ? JSON.parse(stored) : [];
}

/**
 * Retorna o histórico combinado (Classic + Poster)
 * Útil para o calendário que mostra ambos os modos
 */
export function getHistoryCombined(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const classic = getHistoryClassic();
  const poster = getPosterHistory();

  return [...classic, ...poster];
}

// ============ COLOR BLIND FUNCTIONS ============

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
// ============ GRAY FILTER FUNCTIONS ===========

export function getGrayFilter(): boolean {
  if (typeof window === "undefined") {
    console.log("getGrayFilter called on server side");
    return false;
  }
  return localStorage.getItem("grayFilter") === "true";
}
export function setGrayFilter(value: boolean) {

  const handler = setTimeout(() => {
    const fetchData = async () => {
      try {
        if (typeof window === "undefined") {
          console.log("setGrayFilter called on server side");
          return;
        }
        localStorage.setItem("grayFilter", value ? "true" : "false");
      } catch {
        console.log("erro")
      }
    };
    fetchData();
  }, 250);
}



// ============ POSTER MODE FUNCTIONS ============

/**
 * Adiciona uma tentativa no modo Poster
 */
export function appendTryPoster(movieId: number, date: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("tryPoster");
  const tryPoster: PosterTry[] = stored ? JSON.parse(stored) : [];

  // Procura se já existe um item com essa data
  const existingIndex = tryPoster.findIndex((tryItem) => tryItem.date === date);

  if (existingIndex !== -1) {
    // Se existir, incrementa iterações e adiciona o movieId
    tryPoster[existingIndex].iterations++;
    tryPoster[existingIndex].movieIds.push(movieId);
  } else {
    // Se não existir, cria um novo
    tryPoster.unshift({
      id: movieId, // O ID do filme correto será atualizado quando vencer
      date: date,
      iterations: 2,
      movieIds: [movieId],
    });
  }

  localStorage.setItem("tryPoster", JSON.stringify(tryPoster));
}

/**
 * Obtém as tentativas do modo Poster para uma data
 */
export function getTryPoster(date: string): PosterTry | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("tryPoster");
  const tryPoster: PosterTry[] = stored ? JSON.parse(stored) : [];

  // Procura o item com a data especificada
  const dayTries = tryPoster.find((item) => item.date === date);

  return dayTries || null;
}

/**
 * Limpa as tentativas do modo Poster para uma data específica
 */
export function clearTryPoster(date: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("tryPoster");
  const tryPoster: PosterTry[] = stored ? JSON.parse(stored) : [];

  // Remove o item com a data especificada
  const filteredTryPoster = tryPoster.filter((item) => item.date !== date);

  // Se não sobrou nenhum item, remove a chave do localStorage
  if (filteredTryPoster.length === 0) {
    localStorage.removeItem("tryPoster");
  } else {
    // Caso contrário, atualiza com os itens restantes
    localStorage.setItem("tryPoster", JSON.stringify(filteredTryPoster));
  }
}