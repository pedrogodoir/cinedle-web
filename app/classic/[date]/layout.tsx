"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/app/components/modal/Modal";
import { IoSettingsOutline } from "react-icons/io5";
import { ArrowDown, ArrowUp, ChevronRightIcon, Loader2 } from "lucide-react";
import { getColorBlind } from "@/lib/useLocalstorage";
import { History } from "@/components/ui/history";
import WinScreenClassic from "./winScreen/winScreenClassic";

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
  };
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

export default function Classic({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [colorBlind, setColorBlind] = useState(getColorBlind());
  const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isWin, setIsWin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }
    const handler = setTimeout(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `https://cinedle-backend.onrender.com/movies/summary/${search}`
          );
          console.log(res.data);
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
          setResults([]);
        }
      };
      fetchData();
    }, 250);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSelectMovie = (movie: MovieResult) => {
    setSelectedMovie(movie);
    setSearch("");
    setResults([]);
  };

  const handleSubmitGuess = async () => {
    if (!selectedMovie) return;
    setIsLoading(true); // Inicia o loading
    try {
      const res = await axios.get(
        `https://cinedle-backend.onrender.com/classic-games/guess/${selectedMovie.id}`
      );
      console.log(res.data);

      // Tocar som se for correto
      if (res.data.res.correct === true) {
        const audio = new Audio("/sounds/correct_guess.mp3"); // caminho relativo ao public/
        audio.play();
      }

      setGuesses((prevGuesses) => [res.data, ...prevGuesses]);
      setSelectedMovie(null);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  const scrollToHighlighted = (index: number) => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const item = dropdown.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-size-[100vw] bg-no-repeat">
      <header className="relative w-full py-4 flex items-center  justify-center text-white text-5xl font-extrabold px-4">
        <p className="z-10">Cinedle</p>
        <div className="flex items-center justify-center absolute right-100 gap-4 top-1/2 -translate-y-1/2">
          <History />
          <IoSettingsOutline
            size={40}
            className="bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </header>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        colorBlind={colorBlind}
        setColorBlind={setColorBlind}
      />
      {isWin ? (
        <WinScreenClassic
          movieId={guesses[0]?.movie.id}
          totalAttempts={guesses.length}
        />
      ) : (
        children
      )}
    </div>
  );
}
