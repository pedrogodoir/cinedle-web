import * as React from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { MovieResult } from "@/lib/types/resultSearch";
import { Button } from "./button";
import { ChevronRightIcon, Loader2 } from "lucide-react";

export function SearchInput({
  guesses,
  onSubmitGuess,
  disabled = false,
  showButton = true,
}: {
  guesses: any[];
  onSubmitGuess: (movie: MovieResult) => void;
  disabled?: boolean;
  showButton?: boolean;
}) {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<MovieResult[]>([]);
  const [selectedMovie, setSelectedMovie] = React.useState<MovieResult | null>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Busca de filmes com debounce
  React.useEffect(() => {
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
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
          setResults([]);
        }
      };
      fetchData();
    }, 250);

    return () => clearTimeout(handler);
  }, [search]);
  // Filtra filmes já tentados
  const validResults = results.filter((movie) => {
    // Se guesses é array de números (modo Poster)
    if (guesses.length > 0 && typeof guesses[0] === "number") {
      return !guesses.includes(Number(movie.id));
    }
    // Se guesses é array de Guess (modo Classic)
    return !guesses.some((guess) => guess.movie?.id === Number(movie.id));
  });

  // Atualiza selectedMovie quando highlightedIndex muda
  React.useEffect(() => {
    if (highlightedIndex >= 0 && highlightedIndex < validResults.length) {
      setSelectedMovie(validResults[highlightedIndex]);
    }
  }, [highlightedIndex, validResults]);

  // Scroll automático no dropdown
  const scrollToHighlighted = (index: number) => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const item = dropdown.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleSubmit = async () => {
    if (!selectedMovie || disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmitGuess(selectedMovie);
      setSearch("");
      setSelectedMovie(null);
      setHighlightedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative w-72 max-[500px]:w-56 max-[350px]:w-40">
        <input
          value={selectedMovie ? selectedMovie.title : search}
          onChange={(e) => {
            if (selectedMovie) {
              setSelectedMovie(null);
            }
            setSearch(e.target.value);
            setHighlightedIndex(-1);
          }}
          onBlur={() => {
            setTimeout(() => {
              setSearch("");
              setHighlightedIndex(-1);
            }, 200);
          }} onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              if (selectedMovie) {
                // Verifica se o filme já foi tentado antes de submeter
                const movieId = Number(selectedMovie.id);
                const alreadyGuessed = guesses.length > 0 && typeof guesses[0] === "number"
                  ? guesses.includes(movieId) // Modo Poster: guesses é number[]
                  : guesses.some((guess) => guess.movie?.id === movieId); // Modo Classic: guesses é Guess[]

                if (!alreadyGuessed) {
                  handleSubmit();
                }
              } else if (validResults.length > 0) {
                setSelectedMovie(validResults[0]);
                setTimeout(() => handleSubmit(), 0);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) => {
                const nextIndex = (prev + 1) % validResults.length;
                scrollToHighlighted(nextIndex);
                return nextIndex;
              });
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => {
                const nextIndex = (prev - 1 + validResults.length) % validResults.length;
                scrollToHighlighted(nextIndex);
                return nextIndex;
              });
            }
          }}
          className={cn(
            "placeholder:text-muted-foreground bg-black border-3 border-zinc-700 focus:border-zinc-500 focus:ring-0 outline-none rounded-full w-full py-2 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            "text-lg px-4"
          )}
          placeholder="Inception"
          type="text"
          disabled={disabled || isLoading}
        />

        {search && validResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="dropdown-scroll absolute left-0 right-0 mt-2 bg-zinc-950 gap-2 text-white rounded-xl shadow-lg z-10 border-3 border-zinc-700 max-h-60 overflow-y-auto"
          >
            {validResults.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedMovie(item);
                  setHighlightedIndex(index);
                  setSearch("");
                  setTimeout(() => handleSubmit(), 0);
                }}
                className={`text-white hover:bg-zinc-800 hover:rounded-md text-left p-2 cursor-pointer ${index === highlightedIndex ? "bg-zinc-700" : ""
                  }`}
              >
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showButton && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedMovie || isLoading || disabled}
          className="bg-red-500 text-2xl cursor-pointer hover:scale-105 transition-transform disabled:bg-zinc-600 disabled:cursor-not-allowed"
          size="icon"
        >
          {isLoading ? (
            <Loader2 size={35} className="animate-spin p-1 text-white" />
          ) : (
            <ChevronRightIcon size={40} />
          )}
        </Button>
      )}
    </div>
  );
}