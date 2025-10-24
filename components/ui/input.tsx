import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, Loader2 } from "lucide-react";

export function SearchInput({
  search,
  setSearch,
  results,
  setResults,
  selectedMovie,
  setSelectedMovie,
  guesses,
  handleSubmitGuess,
  isLoading,
  dropdownRef,
  highlightedIndex,
  setHighlightedIndex,
  scrollToHighlighted,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  results: any[];
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMovie: any | null;
  setSelectedMovie: React.Dispatch<React.SetStateAction<any | null>>;
  guesses: any[];
  handleSubmitGuess: () => void;
  isLoading: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  scrollToHighlighted: (index: number) => void;
}) {
  return (
    <div className="relative w-72">
      <input
        value={selectedMovie ? selectedMovie.title : search}
        onChange={(e) => {
          if (selectedMovie) {
            setSelectedMovie(null);
          }
          setSearch(e.target.value);
          setHighlightedIndex(-1); // Reseta o índice ao digitar
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLoading) {
            if (selectedMovie) {
              // Envia o palpite se um filme já estiver selecionado
              if (
                !guesses.some(
                  (guess) => guess.movie.id === Number(selectedMovie.id)
                )
              ) {
                handleSubmitGuess();
              }
            } else if (results.length > 0) {
              // Filtra o primeiro filme válido (não tentado)
              const firstValidMovie = results.find(
                (movie) =>
                  !guesses.some((guess) => guess.movie.id === Number(movie.id))
              );

              if (firstValidMovie) {
                setSelectedMovie(firstValidMovie);
                setTimeout(() => handleSubmitGuess(), 0); // Envia o palpite automaticamente
              }
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => {
              const nextIndex = (prev + 1) % results.length;
              scrollToHighlighted(nextIndex);
              return nextIndex;
            });
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => {
              const nextIndex = (prev - 1 + results.length) % results.length;
              scrollToHighlighted(nextIndex);
              return nextIndex;
            });
          }
        }}
        className={cn(
          " placeholder:text-muted-foreground bg-black border-3 border-zinc-700 focus:border-zinc-500 focus:ring-0 outline-none rounded-full w-full py-2 transition-all  disabled:cursor-not-allowed disabled:opacity-50  ",
          "text-lg px-4"
        )}
        placeholder="Inception"
        type="text"
      />

      {search && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="dropdown-scroll absolute left-0 right-0 mt-2 bg-zinc-950 gap-2 text-white rounded-xl shadow-lg z-10 border-3 border-zinc-700 max-h-60 overflow-y-auto"
        >
          {results
            .filter(
              (movie) =>
                !guesses.some(
                  (guess) => guess.movie.id === Number(movie.id)
                )
            )
            .map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedMovie(item)}
                className={`text-white hover:bg-zinc-800 hover:rounded-md text-left p-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-zinc-700" : ""
                }`}
              >
                <p>{item.title}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}