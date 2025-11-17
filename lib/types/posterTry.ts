export type PosterTry = {
  id: number; // ID do filme tentado
  date: string;
  iterations: number; // Número de iterações/tentativas usadas
  movieIds: number[]; // IDs dos filmes tentados em ordem
};
