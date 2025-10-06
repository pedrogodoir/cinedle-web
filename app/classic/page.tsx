'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

type MovieResult = {
  id: string;
  title: string;
};

type Guess = {
  movie: {
    id: number;
    title: string;
    releaseDate: string;
    budget: string;
    genres: { id: number; name: string }[];
    companies: { id: number; name: string }[];
    directors: { id: number; name: string }[];
    actors: { id: number; name: string }[];
  }
  "res ": {
    title: string;
    realeseDate: string;
    budget: string;
    genres: string;
    companies: string;
    directors: string;
    actors: string;
    correct: boolean;
  }
};

export default function Classic() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }
    const handler = setTimeout(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`https://cinedle-backend.onrender.com/movies/summary/${search}`);
          console.log(res.data);
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
          setResults([]);
        }
      };
      fetchData();
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSelectMovie = (movie: MovieResult) => {
    setSelectedMovie(movie);
    setSearch("");
    setResults([]);
  };

  const handleSubmitGuess = async () => {
    if (!selectedMovie) return;
    try {
      const res = await axios.get(`https://cinedle-backend.onrender.com/classic-games/guess/${selectedMovie.id}`);
      console.log(res.data);
      setGuesses(prevGuesses => [res.data, ...prevGuesses]);
      setSelectedMovie(null);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-cover bg-center">
      <header className="text-white text-5xl font-extrabold">Cinedle</header>
      <div className="flex flex-col items-center flex-1 gap-10 text-center pt-40 pb-40">
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-72">
            <Input
              value={selectedMovie ? selectedMovie.title : search}
              onChange={e => {
                if (selectedMovie) {
                  setSelectedMovie(null);
                }
                setSearch(e.target.value);
              }}
              className="border-3 border-zinc-700 p-2 px-3.5 bg-zinc-950 rounded-4xl text-2xl text-white w-full"
              placeholder="Inception"
              type="text"
            />
            {search && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-zinc-950 gap-2 text-white rounded-xl shadow-lg z-10 border-3 border-zinc-700">
                {results.map(item => (
                  <div key={item.id} onClick={() => handleSelectMovie(item)} className="text-white hover:bg-zinc-800 hover:rounded-md text-left p-2 cursor-pointer">
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSubmitGuess} disabled={!selectedMovie} className="bg-red-500 text-2xl cursor-pointer hover:scale-105 transition-transform disabled:bg-zinc-600 disabled:cursor-not-allowed" size={"icon"}>
            <ChevronRightIcon size={40} />
          </Button>
        </div>

        <Table className="bg-zinc-950">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genre(s)</TableHead>
              <TableHead>Main Actor</TableHead>
              <TableHead>Director(s)</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Release</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guesses.map((guess) => (
              <TableRow key={guess.movie.id}>
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center ${guess["res "].title == "incorrect" ? "bg-red-500" : guess["res "].title == "correct" ? "bg-green-500" : guess["res "].title == "parcial" ? "bg-yellow-500" : ""} h-full flex items-center justify-center rounded-md p-2`}>
                    <p className="bg-black/25 rounded-md p-1">
                      {guess.movie.title}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "].genres == "incorrect" ? "bg-red-500" : guess["res "].genres == "correct" ? "bg-green-500" : guess["res "].genres == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    <p className="bg-black/25 rounded-md p-1">
                      {guess.movie.genres.map(g => <p key={g.id}>{g.name}</p>)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "].actors == "incorrect" ? "bg-red-500" : guess["res "].actors == "correct" ? "bg-green-500" : guess["res "].actors == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    <p className="bg-black/25 rounded-md p-1">
                      {guess.movie.actors[0]?.name || 'N/A'}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "] .directors == "incorrect" ? "bg-red-500" : guess["res "].directors == "correct" ? "bg-green-500" : guess["res "].directors == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    <p className="bg-black/25 rounded-md p-1">
                      {guess.movie.directors.map(d => <p key={d.id}>{d.name}</p>)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "].companies == "incorrect" ? "bg-red-500" : guess["res "].companies == "correct" ? "bg-green-500" : guess["res "].companies == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    <p className="bg-black/25 rounded-md p-1">
                      {guess.movie.companies.map(c => <p key={c.id}>{c.name}</p>)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "].budget == "incorrect" ? "bg-red-500" : guess["res "].budget == "correct" ? "bg-green-500" : guess["res "].budget == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(guess.movie.budget))}
                  </div>
                </TableCell>

                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${guess["res "].realeseDate == "incorrect" ? "bg-red-500" : guess["res "].realeseDate == "correct" ? "bg-green-500" : guess["res "].realeseDate == "parcial" ? "bg-yellow-500" : ""} rounded-md p-2`}>
                    {new Date(guess.movie.releaseDate).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div >
  );
}