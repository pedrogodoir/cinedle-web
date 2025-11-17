"use client";

import { SearchInput } from "@/components/ui/input";
import { HistoryItem } from "@/lib/types/historyItem";
import { MovieResult } from "@/lib/types/resultSearch";
import {
  appendHistoryPoster,
  appendTryPoster,
  clearTryPoster,
  getTryPoster,
} from "@/lib/useLocalstorage";
import axios from "axios";
import { useEffect, useState } from "react";
import WinScreenPoster from "../winScreen/winScreenPoster";
import GameOverScreenPoster from "../gameOverScreen/gameOverScreen";
import { PosterGet } from "@/lib/types/posterGet";
import { PosterGame } from "@/lib/types/posterGame";
import { PosterTry } from "@/lib/types/posterTry";

type PosterProps = {
  date: string;
  colorBlind?: boolean;
};

const MAX_ATTEMPTS = 6;

export default function Poster({ date, colorBlind }: PosterProps) {
  const [posterTry, setPosterTry] = useState<PosterTry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [urlImg, setUrlImg] = useState<string>("");
  const [iteration, setIteration] = useState(1);
  const [correctMovieId, setCorrectMovieId] = useState<number | null>(null);
  // Carrega o poster inicial e tentativas anteriores
  useEffect(() => {
    const fetchInitialPoster = async () => {
      setIsLoading(true);
      try {
        // Verifica se já existem tentativas salvas
        const storedTry = getTryPoster(date);

        if (storedTry) {
          // Se já tem tentativas, restaura o estado
          setPosterTry(storedTry);
          const nextIteration = storedTry.iterations + 1;
          setIteration(nextIteration);

          // Busca a imagem da próxima iteração (após a última tentativa)
          const res = await axios.get<PosterGet>(
            `${process.env.NEXT_PUBLIC_API_URL}/poster-games/guess`,
            {
              params: {
                movie_id: -1,
                date: date,
                iteration: nextIteration,
              },
            }
          );
          setUrlImg(res.data.res.next_image);
        } else {
          // Se não tem tentativas, busca a primeira imagem
          const res = await axios.get<PosterGet>(
            `${process.env.NEXT_PUBLIC_API_URL}/poster-games/guess`,
            {
              params: {
                movie_id: -1,
                date: date,
                iteration: 1,
              },
            }
          );
          const updatedTry = getTryPoster(date);
          setUrlImg(res.data.res.next_image);
        }
      } catch (error) {
        console.error("Failed to fetch poster:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPoster();
  }, [date]); const handleSubmitGuess = async (movie: MovieResult) => {
    // Verifica se já atingiu o limite de tentativas
    if (iteration > MAX_ATTEMPTS) {
      return;
    }

    setIsLoading(true);
    try {
      const movieId = Number(movie.id);

      const res = await axios.get<PosterGet>(
        `${process.env.NEXT_PUBLIC_API_URL}/poster-games/guess`,
        {
          params: {
            movie_id: movieId,
            date: date,
            iteration: iteration,
          },
        }
      );

      const posterGet: PosterGet = res.data;

      // Salva a tentativa no localStorage
      appendTryPoster(movieId, date);

      // Atualiza o estado local com as novas tentativas
      const updatedTry = getTryPoster(date);
      if (updatedTry) {
        setPosterTry(updatedTry);
      }

      if (posterGet.res.correct === true) {
        // Vitória!
        const audio = new Audio("/sounds/correct_guess.mp3");
        audio.play();        // Salva no histórico
        const newHistoryItem: HistoryItem = {
          date: date,
          id: movieId,
          totalAttempts: iteration,
          mode: "poster",
        };

        appendHistoryPoster(newHistoryItem);
        clearTryPoster(date);
        setCorrectMovieId(movieId);
        setIsWin(true);
      } else {
        // Tentativa incorreta - atualiza a imagem para a próxima iteração
        if (posterGet.res.next_image) {
          setUrlImg(posterGet.res.next_image);
        }
        setIteration((prev) => prev + 1);

        // Se atingiu 6 tentativas e ainda não acertou, mostra mensagem
        if (iteration >= MAX_ATTEMPTS) {
          // TODO: Implementar tela de derrota
          const fail_sound = new Audio("/sounds/fail_sound.mp3");
          fail_sound.play();   
          const res = await axios.get<PosterGame>(
            `${process.env.NEXT_PUBLIC_API_URL}/poster-games`,
            {
              params: {
                date: date,
              },
            }
          );
          console.log(res.data.res)
          const newHistoryItem: HistoryItem = {
            date: date,
            id: res.data.res.movie_id,
            totalAttempts: iteration,
            mode: "poster",
          };
          appendHistoryPoster(newHistoryItem);
          clearTryPoster(date);
          setCorrectMovieId(res.data.res.movie_id);
          console.log("Máximo de tentativas atingido!");
        }
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      // TODO: Mostrar mensagem de erro para o usuário
    } finally {
      setIsLoading(false);
    }
  }; return isWin ? (
    <WinScreenPoster
      movieId={correctMovieId || 0}
      totalAttempts={posterTry?.iterations || iteration - 1}
    />
  ) : iteration > MAX_ATTEMPTS ?(
    <GameOverScreenPoster
      movieId={correctMovieId || 0}
      totalAttempts={posterTry?.iterations || iteration - 1}
    />

  ) : (
    <div className="flex flex-col flex-1 gap-5 text-center pt-10 max-w-full px-4">
      {/* Container da imagem com transição suave */}
      <div className="flex items-center justify-center p-2 bg-zinc-950 bg-opacity-50 border-3 border-zinc-700 rounded-lg shadow-lg max-w-md mx-auto transition-all duration-300">
        {urlImg ? (
          <img
            src={urlImg}
            width="300"
            alt="Movie poster"
            className="rounded-md"
          />
        ) : (
          <div className="w-[300px] h-[450px] flex items-center justify-center">
            <div className="text-white text-sm">Carregando...</div>
          </div>
        )}
      </div>

      {/* Contador de tentativas com cores */}
      <div className="text-white text-sm mb-2 font-medium">
        <span className={iteration > 4 ? "text-yellow-400" : ""}>
          Tentativa {Math.min(iteration, MAX_ATTEMPTS)} de {MAX_ATTEMPTS}
        </span>
        {iteration > MAX_ATTEMPTS && (
          <div className="text-red-400 text-xs mt-1">
            Máximo de tentativas atingido
          </div>
        )}
      </div>

      {/* Histórico de tentativas */}
      {posterTry && posterTry.movieIds.length > 0 && (
        <div className="flex flex-col gap-1 mb-2 max-w-md mx-auto w-full">
          <div className="text-white text-xs font-semibold mb-1">
            Filmes já tentados:
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {posterTry.movieIds.map((id, index) => (
              <div
                key={`${id}-${index}`}
                className="bg-red-500 bg-opacity-20 border border-red-500 text-white text-xs px-2 py-1 rounded"
              >
                #{posterTry.movieIds.length - index}
              </div>
            ))}
          </div>
        </div>
      )}

      <SearchInput
        guesses={posterTry?.movieIds || []}
        onSubmitGuess={handleSubmitGuess}
        disabled={isLoading || iteration > MAX_ATTEMPTS}
        showButton={true}
      />
    </div>
  );
}
