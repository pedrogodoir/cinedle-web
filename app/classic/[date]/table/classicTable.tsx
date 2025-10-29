"use client";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoryItem } from "@/lib/types/historyItem";
import { MovieResult } from "@/lib/types/resultSearch";
import { Guess } from "@/lib/types/movieGuess";
import {
  appendHistoryItem,
  getColorBlind,
  getHistory,
} from "@/lib/useLocalstorage";
import axios from "axios";
import { ArrowDown, ArrowUp, ChevronRightIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, RefObject } from "react";
import WinScreenClassic from "../winScreen/winScreenClassic";

type ClassicTableProps = {
  date: string;
  colorBlind?: boolean;
};

export default function ClassicTable({ date, colorBlind }: ClassicTableProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
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
            `${process.env.NEXT_PUBLIC_API_URL}/movies/summary/${search}`
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

  const handleSubmitGuess = async () => {
    if (!selectedMovie) return;
    setIsLoading(true); // Inicia o loading
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classic-games/guess`,
        {
          params: {
            movie_id: selectedMovie.id,
            date: date,
          },
        }
      );
      console.log(res.data);

      // Tocar som se for correto
      if (res.data.res.correct === true) {
        const audio = new Audio("/sounds/correct_guess.mp3"); // caminho relativo ao public/
        audio.play();

        // Adicionar ao histórico
        const newHistoryItem: HistoryItem = {
          // pega o date do params
          date: date,
          id: res.data.movie.id,
          totalAttempts: guesses.length + 1,
        };
        appendHistoryItem(newHistoryItem);

        setIsWin(true);
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

  const getCellColor = (value: string) => {
    if (colorBlind) {
      switch (value) {
        case "correct":
          return "bg-sky-700";
        case "incorrect":
          return "bg-orange-600";
        case "parcial":
        case "more":
        case "less":
          return "bg-yellow-300";
        default:
          return "";
      }
    }
    switch (value) {
      case "correct":
        return "bg-green-500";
      case "incorrect":
        return "bg-red-500";
      case "parcial":
      case "more":
      case "less":
        return "bg-yellow-500";
      default:
        return "";
    }
  };

  return isWin ? (
    <WinScreenClassic
      movieId={guesses[0]?.movie.id}
      totalAttempts={guesses.length}
    />
  ) : (
    <div className="flex flex-col items-center flex-1 gap-10 text-center pt-40 pb-40">
      <div className="flex items-center justify-center gap-6">
        <div className="relative w-72">
          <SearchInput
            search={search}
            setSearch={setSearch}
            results={results}
            setResults={setResults}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            guesses={guesses}
            handleSubmitGuess={handleSubmitGuess}
            isLoading={isLoading}
            dropdownRef={dropdownRef as RefObject<HTMLDivElement>}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            scrollToHighlighted={scrollToHighlighted}
          />
        </div>

        <Button
          onClick={handleSubmitGuess}
          disabled={!selectedMovie || isLoading}
          className={`bg-red-500 text-2xl cursor-pointer hover:scale-105 transition-transform disabled:bg-zinc-600 disabled:cursor-not-allowed`}
          size={"icon"}
        >
          {isLoading ? (
            <Loader2 size={35} className="animate-spin p-1 text-white" />
          ) : (
            <ChevronRightIcon size={40} />
          )}
        </Button>
      </div>

      <Table className="bg-zinc-950">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre(s)</TableHead>
            <TableHead>Lead Actor</TableHead>
            <TableHead>Director(s)</TableHead>
            <TableHead>Companies</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Release</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guesses.map((guess) => (
            <TableRow key={guess.movie.id}>
              {/* Title */}
              <TableCell
                className={`flex items-center justify-center  bg-repeat-x bg-bottom`}
              >
                <div
                  className={`  h-full w-full align-center flex items-center justify-center  bg-cover rounded-md`}
                  style={{
                    backgroundImage: `url(${guess.movie.poster})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <p className="bg-black/25 w-full p-1">{guess.movie.title}</p>
                </div>
              </TableCell>

              {/* Genre */}
              <TableCell className="fle</TableCell>x items-center justify-center">
                <div
                  className={`h-full w-full align-center gap-0.5 flex-col flex items-center justify-center ${getCellColor(
                    guess.res.genres
                  )} rounded-md`}
                >
                  {guess.movie.genres.map((g) => (
                    <p key={g.id} className="bg-black/25 w-full p-1">
                      {g.name}
                    </p>
                  ))}
                </div>
              </TableCell>

              {/* Actor */}
              <TableCell className="flex items-center justify-center">
                <div
                  className={`h-full w-full align-center flex items-center justify-center ${getCellColor(
                    guess.res.actors
                  )} rounded-md`}
                >
                  <p className="bg-black/25 w-full p-1">
                    {guess.movie.actors[0]?.name || "N/A"}
                  </p>
                </div>
              </TableCell>

              {/* Director */}
              <TableCell className="flex items-center justify-center">
                <div
                  className={`h-full w-full align-center flex-col gap-0.5 flex items-center justify-center ${getCellColor(
                    guess.res.directors
                  )} rounded-md`}
                >
                  {guess.movie.directors.map((d) => (
                    <p key={d.id} className="bg-black/25 w-full p-1">
                      {d.name}
                    </p>
                  ))}
                </div>
              </TableCell>

              {/* Company */}
              <TableCell className="flex items-center justify-center">
                <div
                  className={`h-full w-full flex-col gap-0.5 align-center flex items-center justify-center ${getCellColor(
                    guess.res.companies
                  )} rounded-md`}
                >
                  {guess.movie.companies.map((c) => (
                    <p key={c.id} className="bg-black/25 w-full p-1">
                      {c.name}
                    </p>
                  ))}
                </div>
              </TableCell>

              {/* Budget */}
              <TableCell className="flex items-center justify-center">
                <div
                  className={` relative h-full w-full align-center ${getCellColor(
                    guess.res.budget
                  )} h-full flex items-center justify-center rounded-md`}
                >
                  <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(guess.movie.budget))}
                  </p>
                  {guess.res.budget === "less" && (
                    <ArrowDown
                      size="100%"
                      strokeWidth={3}
                      className="absolute z-0 text-zinc-800"
                    />
                  )}
                  {guess.res.budget === "more" && (
                    <ArrowUp
                      size="100%"
                      strokeWidth={3}
                      className="absolute z-0 text-zinc-800"
                    />
                  )}
                </div>
              </TableCell>
              {/* Release Date */}
              <TableCell className="flex items-center justify-center">
                <div
                  className={` relative h-full w-full max-w-full max-h-full align-center ${getCellColor(
                    guess.res.releaseDate
                  )} h-full flex items-center justify-center rounded-md`}
                >
                  <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
                    {new Date(guess.movie.releaseDate).getFullYear()}
                  </p>
                  {guess.res.releaseDate === "less" && (
                    <ArrowDown
                      size="100%"
                      strokeWidth={3}
                      className="absolute z-0 text-zinc-800"
                    />
                  )}
                  {guess.res.releaseDate === "more" && (
                    <ArrowUp
                      size="100%"
                      strokeWidth={3}
                      className="absolute z-0 text-zinc-800"
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
