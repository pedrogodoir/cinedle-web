import { Movie } from "./movieType";

export type Guess = {
  movie: Movie;
  res: {
    title: string;
    releaseDate: string;
    budget: string;
    genres: string;
    companies: string;
    directors: string;
    actors: string;
    correct: boolean;
  };
};