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
  id: number;
  title: string;
  releaseDate: string;
  budget: string;
  genres: { id: number; name: string }[];
  companies: { id: number; name: string }[];
  directors: { id: number; name: string }[];
  actors: { id: number; name: string }[];
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
      const res = await axios.get(`https://cinedle-backend.onrender.com/movies/${selectedMovie.id}`);
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
              <TableRow key={guess.id}>
                <TableCell><div className="bg-green-500 rounded-md p-2">{guess.title}</div></TableCell>
                <TableCell><div className="bg-yellow-500 rounded-md p-2">{guess.genres.map(g => <p key={g.id}>{g.name}</p>)}</div></TableCell>
                <TableCell><div className="bg-red-500 rounded-md p-2">{guess.actors[0]?.name || 'N/A'}</div></TableCell>
                <TableCell><div className="bg-green-500 rounded-md p-2">{guess.directors.map(d => <p key={d.id}>{d.name}</p>)}</div></TableCell>
                <TableCell><div className="bg-yellow-500 rounded-md p-2">{guess.companies.map(c => <p key={c.id}>{c.name}</p>)}</div></TableCell>
                <TableCell><div className="bg-yellow-500 rounded-md p-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(guess.budget))}</div></TableCell>
                <TableCell><div className="bg-yellow-500 rounded-md p-2">{new Date(guess.releaseDate).toLocaleDateString()}</div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}