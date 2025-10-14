'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../components/modal/Modal";
import { IoSettingsOutline } from "react-icons/io5";
import { ArrowDown, ArrowUp, ChevronRightIcon, Loader2 } from "lucide-react";


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
    releaseDate: string;
    budget: string;
    genres: string;
    companies: string;
    directors: string;
    actors: string;
    correct: boolean;
  }
};

export default function Classic() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const colorBlindActive = localStorage.getItem("colorBlind") === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      const res = await axios.get(`https://cinedle-backend.onrender.com/classic-games/guess/${selectedMovie.id}`);
      console.log(res.data);

      // Tocar som se for correto
      if (res.data["res "]?.correct === true) {
        const audio = new Audio('/sounds/correct_guess.mp3'); // caminho relativo ao public/
        audio.play();
      }

      setGuesses(prevGuesses => [res.data, ...prevGuesses]);
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

    if (colorBlindActive){    
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
    };
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

  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem("colorBlind") === "true"
  );

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen bg-black bg-[url(/bg-classic.png)] bg-size-[100vw] bg-no-repeat">
        <header className="relative w-full py-4 flex items-center justify-center text-white text-5xl font-extrabold">

  <p className="z-10">Cinedle</p>

  
  <IoSettingsOutline
    size={40}
    className="absolute right-10 md:right-100 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
    onClick={() => setIsModalOpen(true)}
  />
</header>
      <Modal
              isOpen={isModalOpen}
              onClose={() => {setIsModalOpen(false)}}
              colorBlind={colorBlind}
              setColorBlind={setColorBlind}
            />

      <div className="flex flex-col items-center flex-1 gap-10 text-center pt-40 pb-40">
        <div className="flex items-center justify-center gap-6">
          <div className="relative w-72">
            <Input
              value={selectedMovie ? selectedMovie.title : search}
              onChange={(e) => {
                if (selectedMovie) {
                  setSelectedMovie(null);
                }
                setSearch(e.target.value);
                setHighlightedIndex(-1); // Reseta o índice ao digitar
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) { // Bloqueia múltiplos envios enquanto está carregando
                  if (selectedMovie) {
                    // Verifica se o filme já foi tentado antes de enviar
                    if (!guesses.some((guess) => guess.movie.id === Number(selectedMovie.id))) {
                      handleSubmitGuess();
                    }
                  } else if (results.length === 1) {
                    handleSelectMovie(results[0]);
                    setTimeout(() => handleSubmitGuess(), 0);
                  } else if (highlightedIndex >= 0 && results[highlightedIndex]) {
                    handleSelectMovie(results[highlightedIndex]);
                  } else if (results.length > 0) {
                    // Seleciona o primeiro item válido se nenhum tiver destacado
                    const firstMovie = results.find(
                      (movie) => !guesses.some((guess) => guess.movie.id === Number(movie.id))
                    );
                    if (firstMovie) {
                      handleSelectMovie(firstMovie);
                    }
                  }
                } else if (e.key === "ArrowDown" || e.key === "Tab") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const nextIndex = (prev + 1) % results.length;
                    scrollToHighlighted(nextIndex); // Rola até o item destacado
                    return nextIndex;
                  });
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const nextIndex =
                      (prev - 1 + results.length) % results.length;
                    scrollToHighlighted(nextIndex); // Rola até o item destacado
                    return nextIndex;
                  });
                }
              }}
              className="border-3 border-zinc-700 p-2 px-3.5 bg-zinc-950 rounded-4xl text-base text-white w-full"
              placeholder="Inception"
              type="text"
            />

            {search && results.length > 0 && (
              <div
                ref={dropdownRef}
                className="dropdown-scroll absolute left-0 right-0 mt-2 bg-zinc-950 gap-2 text-white rounded-xl shadow-lg z-10 border-3 border-zinc-700 max-h-60 overflow-y-auto"
              >
                {results
                  .filter((movie) => !guesses.some((guess) => guess.movie.id === Number(movie.id)))
                  .map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectMovie(item)}
                      className={`text-white hover:bg-zinc-800 hover:rounded-md text-left p-2 cursor-pointer ${index === highlightedIndex ? "bg-zinc-700" : ""
                        }`}
                    >
                      <p>{item.title}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmitGuess}
            disabled={!selectedMovie || isLoading} // Desabilita o botão enquanto está carregando
            className={`bg-red-500 text-2xl cursor-pointer hover:scale-105 transition-transform disabled:bg-zinc-600 disabled:cursor-not-allowed ${isLoading ? "opacity-70" : ""}`}
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
              <TableHead>Actor</TableHead>
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
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${getCellColor(guess["res "].title)} rounded-md`}>
                    <p className="bg-black/25 w-full p-1">{guess.movie.title}</p>
                  </div>
                </TableCell>

                {/* Genre */}
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center gap-0.5 flex-col flex items-center justify-center ${getCellColor(guess["res "].genres)} rounded-md`}>
                    {guess.movie.genres.map(g => <p key={g.id} className="bg-black/25 w-full p-1">{g.name}</p>)}
                  </div>
                </TableCell>

                {/* Actor */}
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex items-center justify-center ${getCellColor(guess["res "].actors)} rounded-md`}>
                    <p className="bg-black/25 w-full p-1">{guess.movie.actors[0]?.name || 'N/A'}</p>
                  </div>
                </TableCell>

                {/* Director */}
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full align-center flex-col gap-0.5 flex items-center justify-center ${getCellColor(guess["res "].directors)} rounded-md`}>
                    {guess.movie.directors.map(d => <p key={d.id} className="bg-black/25 w-full p-1">{d.name}</p>)}
                  </div>
                </TableCell>

                {/* Company */}
                <TableCell className="flex items-center justify-center">
                  <div className={`h-full w-full flex-col gap-0.5 align-center flex items-center justify-center ${getCellColor(guess["res "].companies)} rounded-md`}>
                    {guess.movie.companies.map(c => <p key={c.id} className="bg-black/25 w-full p-1">{c.name}</p>)}
                  </div>
                </TableCell>

                {/* Budget */}
                <TableCell className="flex items-center justify-center">
                  <div className={` relative h-full w-full align-center ${getCellColor(guess["res "].budget)} h-full flex items-center justify-center rounded-md`}>
                    <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(guess.movie.budget))}
                    </p>
                    {guess["res "].budget === "less" && <ArrowDown size="100%" strokeWidth={3} className="absolute z-0 text-zinc-800" />}
                    {guess["res "].budget === "more" && <ArrowUp size="100%" strokeWidth={3} className="absolute z-0 text-zinc-800" />}
                  </div>
                </TableCell>
                {/* Release Date */}
                <TableCell className="flex items-center justify-center">
                  <div className={` relative h-full w-full max-w-full max-h-full align-center ${getCellColor(guess["res "].releaseDate)} h-full flex items-center justify-center rounded-md`}>
                    <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
                      {new Date(guess.movie.releaseDate).toLocaleDateString()}
                    </p>
                    {guess["res "].releaseDate === "less" && <ArrowDown size="100%" strokeWidth={3} className="absolute z-0 text-zinc-800" />}
                    {guess["res "].releaseDate === "more" && <ArrowUp size="100%" strokeWidth={3} className="absolute z-0 text-zinc-800" />}
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