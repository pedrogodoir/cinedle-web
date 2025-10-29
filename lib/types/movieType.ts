export type Movie = {
  id: number;
  title: string;
  poster: string;
  releaseDate: string;
  budget: string;
  genres: { id: number; name: string }[];
  companies: { id: number; name: string }[];
  directors: { id: number; name: string }[];
  actors: { id: number; name: string }[];
};
