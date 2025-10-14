import { Movie } from "@/lib/types/movieType";
import axios from "axios";
import React, { useEffect } from "react";

function WinScreenClassic({
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
          `https://cinedle-backend.onrender.com/movies/${movieId}`
        );
        setMovie(res.data);
      } catch {
        console.log("erro fetching data");
      }
    };
    fetchData();
  }, [movieId]);

  /*montar aqui uma telinha bem bonitinha com o movie*/
  return (
    <div>
      <h1>{movie?.title}</h1>
      <p>Total Attempts: {totalAttempts}</p>
    </div>
  );
}

export default WinScreenClassic;
