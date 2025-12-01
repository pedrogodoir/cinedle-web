import { Movie } from "@/lib/types/movieType";
import axios from "axios";
import confetti from "canvas-confetti";
import React, { useEffect, useState } from "react";

function GameOverScreenPoster({
  movieId,
  totalAttempts,
}: {
  movieId: number | undefined;
  totalAttempts: number | undefined;
}) {
  const [movie, setMovie] = React.useState<Movie | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}`
        );
        setMovie(res.data);
      } catch {
        console.log("erro fetching data");
      }
    };
    fetchData();
  }, [movieId]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-10 text-center pt-20 pb-20">
      <h1 className="text-4xl font-extrabold text-white">💔 GAME OVER! 🙈</h1>
      <div className="flex bg-zinc-950 p-6 border-zinc-700 border-3 rounded-xl gap-8 shadow-lg max-w-4xl">
        {/* Poster */}
        <div className=" h-96 w-64 min-w-64 flex items-center justify-center text-white text-lg font-semibold">
          {/* "No Poster Available" Codigo pronto para quando haver poster */}
          {movie?.poster ? (
            <img
              src={movie.poster}
              alt={`${movie.title} Poster`}
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            "No Poster Available"
          )}
        </div>

        {/* Movie Details */}
        <div className="flex flex-col gap-6 text-white text-left">
          <div>
            <h2 className="text-3xl font-bold">{movie?.title}</h2>
            <p className="text-lg text-zinc-400">
              {movie?.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown Release Date"}
            </p>
          </div>
          <p className="text-md">
            <span className="font-semibold">Budget:</span>{" "}
            {movie?.budget
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(movie.budget))
              : "Unknown Budget"}
          </p>
          <p className="text-md">
            <span className="font-semibold">Genres:</span>{" "}
            {movie?.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p className="text-md">
            <span className="font-semibold">Companies:</span>{" "}
            {movie?.companies.map((company) => company.name).join(", ")}
          </p>
          <p className="text-md">
            <span className="font-semibold">Directors:</span>{" "}
            {movie?.directors.map((director) => director.name).join(", ")}
          </p>
          <p className="text-md">
            <span className="font-semibold">Actors:</span>{" "}
            {movie?.actors.map((actor) => actor.name).join(", ")}
          </p>
          <p className="text-lg font-bold text-red-400">
            6 Chances weren't enough for you! 😥
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreenPoster;
