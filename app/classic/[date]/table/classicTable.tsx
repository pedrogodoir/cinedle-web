"use client";

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
import { Guess } from "@/lib/types/movieGuess";
import { MovieResult } from "@/lib/types/resultSearch";
import {
  appendHistoryClassic,
  appendTryClassic,
  clearTryClassic, // Adicione esta linha
  getTryClassic,
} from "@/lib/useLocalstorage";
import axios from "axios";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import WinScreenClassic from "../winScreen/winScreenClassic";
import AbstractLineComponent from "./components/abstractLine";
import { Separator } from "@/components/ui/separator";

type ClassicTableProps = {
  date: string;
  colorBlind?: boolean;
};

export default function ClassicTable({ date, colorBlind }: ClassicTableProps) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    // Carrega as tentativas do localStorage quando o componente monta
    const storedGuesses = getTryClassic(date);

    if (storedGuesses.length > 0) {
      setGuesses(storedGuesses);

      // Verifica se a última tentativa foi uma vitória
      const lastGuess = storedGuesses[0];
      if (lastGuess.res.correct === true) {
        setIsWin(true);
      }
    }
  }, [date]); // Recarrega se a data mudar

  const handleSubmitGuess = async (movie: MovieResult) => {
    setIsLoading(true);
    try {
      // Tipar a resposta como Guess (contém `movie` e `res`)
      //usem o TYPEscript :)
      const res = await axios.get<Guess>(
        `${process.env.NEXT_PUBLIC_API_URL}/classic-games/guess`,
        {
          params: {
            movie_id: movie.id,
            date: date,
          },
        }
      );

      const guess: Guess = res.data;
      if (guess.res.correct === true) {
        const audio = new Audio("/sounds/correct_guess.mp3");
        audio.play();

        // Garantir que o id do HistoryItem seja number (Movie.id em `Guess` é number)
        const newHistoryItem: HistoryItem = {
          date: date,
          id: guess.movie.id,
          totalAttempts: guesses.length + 1,
          mode: "classic",
          result: "win",
        };

        appendHistoryClassic(newHistoryItem);
        clearTryClassic(date);
        setIsWin(true);
      } else {
        appendTryClassic(guess, date);
      }

      setGuesses((prevGuesses) => [guess, ...prevGuesses]);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    } finally {
      setIsLoading(false);
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
    <div className="flex flex-col flex-1 gap-10 text-center pt-14 pb-40 max-w-full">
      <SearchInput
        guesses={guesses}
        onSubmitGuess={handleSubmitGuess}
        disabled={isLoading}
        showButton={true}
      />
      <div className="dropdown-scroll overflow-x-auto max-w-full px-4">
        <Table className="bg-zinc-950 min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-200px">Title</TableHead>
              <TableHead>Genre(s)</TableHead>
              <TableHead>Lead Actor</TableHead>
              <TableHead>Director(s)</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Release</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* abstract line */}
            {guesses.length > 0 && (
              <>
                <AbstractLineComponent
                  guesses={guesses}
                  getCellColor={getCellColor}
                />
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex items-center justify-center mx-4">
                      <Separator className="my-2" />
                    </div>
                  </TableCell>
                </TableRow>
              </>
            )}
            {guesses.map((guess) => (
              <TableRow key={guess.movie.id}>
                {/* Title */}
                <TableCell className="flex items-center justify-center bg-repeat-x bg-bottom">
                  <div
                    className={` text-wrap h-full w-[200px] align-center flex items-center justify-center max-w-md  bg-cover rounded-md`}
                    style={{
                      backgroundImage: `url(${guess.movie.poster})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="bg-black/25 p-1 w-full break-words whitespace-normal">
                      {guess.movie.title}
                    </p>
                  </div>
                </TableCell>

                {/* Genre */}
                <TableCell className="flex items-center justify-center">
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
                    className={`h-full w-full align-center gap-0.5 flex-col flex items-center justify-center ${getCellColor(
                      guess.res.actors
                    )} rounded-md`}
                  >
                    {guess.movie.actors.map((a) => (
                      <p key={a.id} className="bg-black/25 w-full p-1">
                        {a.name}
                      </p>
                    ))}
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
    </div>
  );
}
