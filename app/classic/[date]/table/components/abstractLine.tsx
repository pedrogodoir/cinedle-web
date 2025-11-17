import { TableCell, TableRow } from "@/components/ui/table";
import { Guess } from "@/lib/types/movieGuess";
import { extractYear, leftJoinDiffUnique } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

function aggregateArrays(arrays: ItemArray[]) {
  const parcialList: string[] = [];
  const incorrectList: string[] = [];

  for (const arr of arrays) {
    if (arr.status === "correct") {
      //  retorna o primeiro correto encontrado
      return { values: arr.values, status: "correct" as const };
    }

    if (arr.status === "parcial") {
      parcialList.push(...arr.values);
    } else if (arr.status === "incorrect") {
      incorrectList.push(...arr.values);
    }
  }

  const res = leftJoinDiffUnique(parcialList, incorrectList);
  if (res.length > 0) {
    return { values: res, status: "parcial" as const };
  } else {
    return { values: [], status: "incorrect" as const };
  }
}

function aggregateNumericField(
  field: NumericField,
  n: number,
  currState: string
): NumericField {
  let min = field.min ?? null;
  let max = field.max ?? null;

  if (currState === "correct") {
    return { min: n, max: n, status: "correct" };
  }

  if (currState === "less") {
    if (max === null) max = n;
    else max = Math.min(max, n);
  } else if (currState === "more") {
    if (min === null) min = n;
    else min = Math.max(min, n);
  }

  let status: "parcial" | "more" | "less" | "correct" | "incorrect";

  if (min !== null && max !== null) {
    status = "parcial";
  } else if (min !== null) {
    status = "more";
  } else if (max !== null) {
    status = "less";
  } else {
    status = "incorrect";
  }

  return { min, max, status };
}
const handleAbstract = (guesses: Guess[]): AbstractLine => {
  const allGenres: ItemArray[] = [];
  const allCompanies: ItemArray[] = [];
  const allDirectors: ItemArray[] = [];
  const allActors: ItemArray[] = [];
  let releaseDate: NumericField = {
    min: null,
    max: null,
    status: "parcial",
  };
  let budget: NumericField = {
    min: null,
    max: null,
    status: "parcial",
  };

  // Flags para pular processamento de atributos já resolvidos como `correct`
  let genresResolved = false;
  let companiesResolved = false;
  let directorsResolved = false;
  let actorsResolved = false;
  let releaseDateResolved = false;
  let budgetResolved = false;

  guesses.forEach((guess) => {
    // Arrays (genres, companies, directors, actors)
    if (!genresResolved) {
      const genresNames: string[] = guess.movie.genres.map((g) => g.name);
      if (guess.res.genres === "correct") {
        // se correto, armazenamos somente esse e marcamos como resolvido
        allGenres.push({ values: genresNames, status: "correct" });
        genresResolved = true;
      } else {
        allGenres.push({ values: genresNames, status: guess.res.genres });
      }
    }

    if (!companiesResolved) {
      const companiesNames: string[] = guess.movie.companies.map((c) => c.name);
      if (guess.res.companies === "correct") {
        allCompanies.push({ values: companiesNames, status: "correct" });
        companiesResolved = true;
      } else {
        allCompanies.push({
          values: companiesNames,
          status: guess.res.companies,
        });
      }
    }

    if (!directorsResolved) {
      const directorsNames: string[] = guess.movie.directors.map((d) => d.name);
      if (guess.res.directors === "correct") {
        allDirectors.push({ values: directorsNames, status: "correct" });
        directorsResolved = true;
      } else {
        allDirectors.push({
          values: directorsNames,
          status: guess.res.directors,
        });
      }
    }

    if (!actorsResolved) {
      const actorsNames: string[] = guess.movie.actors.map((a) => a.name);
      if (guess.res.actors === "correct") {
        allActors.push({ values: actorsNames, status: "correct" });
        actorsResolved = true;
      } else {
        allActors.push({ values: actorsNames, status: guess.res.actors });
      }
    }

    // Numeric fields: somente processa enquanto não estiverem resolvidos
    if (!releaseDateResolved) {
      releaseDate = aggregateNumericField(
        releaseDate,
        extractYear(guess.movie.releaseDate),
        guess.res.releaseDate
      );
      if (releaseDate.status === "correct") releaseDateResolved = true;
    }

    if (!budgetResolved) {
      budget = aggregateNumericField(
        budget,
        Number(guess.movie.budget),
        guess.res.budget
      );
      if (budget.status === "correct") budgetResolved = true;
    }
  });

  const abstract: AbstractLine = {
    releaseDate: releaseDate,
    budget: budget,
    genres: aggregateArrays(allGenres),
    companies: aggregateArrays(allCompanies),
    directors: aggregateArrays(allDirectors),
    actors: aggregateArrays(allActors),
  };
  console.log("abstract", abstract);
  return abstract;
};

const formatYear = (field: NumericField): string => {
  const { min, max, status } = field;
  if (status === "correct") {
    return String(max);
  }
  if (min === null && max === null) {
    return "?";
  }
  if (min === null && max !== null) {
    return String(max);
  }
  if (min !== null && max === null) {
    return `${min}`;
  }

  if (min !== null && max !== null) {
    if (min < max) {
      return `${min} - ${max}`;
    }
    return String(min);
  }

  return "?";
};

const formatBudget = (field: NumericField): string => {
  const { min, max, status } = field;
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const f = (n: number) => fmt.format(n / 1_000_000) + "M";

  if (status === "correct") {
    return f(max!);
  }
  if (min === null && max === null) {
    return "?";
  }

  if (min === null && max !== null) {
    return f(max);
  }

  if (min !== null && max === null) {
    return `${f(min)}`;
  }

  if (min !== null && max !== null) {
    if (min < max) {
      return `${f(min)} - ${f(max)}`;
    }
    return f(min);
  }
  return "?";
};
const AbstractLineComponent = ({
  guesses,
  getCellColor,
}: {
  guesses: Guess[];
  getCellColor: (value: string) => string;
}) => {
  const abstract = handleAbstract(guesses);

  return (
    <TableRow>
      {/* Title */}
      <TableCell className="flex items-center justify-center bg-repeat-x bg-bottom">
        <div
          className={` text-wrap h-full w-[200px] align-center flex items-center justify-center max-w-md  bg-cover rounded-md`}
        >
          <p className="bg-black/25 p-1 w-full break-words whitespace-normal">
            Resumo
          </p>
        </div>
      </TableCell>

      {/* Genre */}
      <TableCell className="flex items-center justify-center">
        <div
          className={`h-full w-full align-center gap-0.5 flex-col flex items-center justify-center ${getCellColor(
            abstract.genres.status
          )} rounded-md`}
        >
          {abstract.genres.values.map((s) => (
            <p key={s} className="bg-black/25 w-full p-1">
              {s}
            </p>
          ))}
        </div>
      </TableCell>

      {/* Actor */}
      <TableCell className="flex items-center justify-center">
        <div
          className={`h-full w-full align-center flex items-center justify-center ${getCellColor(
            abstract.actors.status
          )} rounded-md`}
        >
          {abstract.actors.values.length > 0 ? (
            <p className="bg-black/25 w-full p-1">
              {abstract.actors.values[0] || ""}
            </p>
          ) : (
            ""
          )}
        </div>
      </TableCell>

      {/* Director */}
      <TableCell className="flex items-center justify-center">
        <div
          className={`h-full w-full align-center flex-col gap-0.5 flex items-center justify-center ${getCellColor(
            abstract.directors.status
          )} rounded-md`}
        >
          {abstract.directors.values.map((d) => (
            <p key={d} className="bg-black/25 w-full p-1">
              {d}
            </p>
          ))}
        </div>
      </TableCell>

      {/* Company */}
      <TableCell className="flex items-center justify-center">
        <div
          className={`h-full w-full flex-col gap-0.5 align-center flex items-center justify-center ${getCellColor(
            abstract.companies.status
          )} rounded-md`}
        >
          {abstract.companies.values.map((c) => (
            <p key={c} className="bg-black/25 w-full p-1">
              {c}
            </p>
          ))}
        </div>
      </TableCell>

      {/* Budget */}
      <TableCell className="flex items-center justify-center">
        <div
          className={` relative h-full w-full align-center ${getCellColor(
            abstract.budget.status
          )} h-full flex items-center justify-center rounded-md`}
        >
          <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
            {formatBudget(abstract.budget)}
          </p>
          {abstract.budget.status === "less" && (
            <ArrowDown
              size="100%"
              strokeWidth={3}
              className="absolute z-0 text-zinc-800"
            />
          )}
          {abstract.budget.status === "more" && (
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
            abstract.releaseDate.status
          )} h-full flex items-center justify-center rounded-md`}
        >
          <p className="bg-black/25 w-full p-1 flex items-center justify-center z-10">
            {formatYear(abstract.releaseDate)}
          </p>
          {abstract.releaseDate.status === "less" && (
            <ArrowDown
              size="100%"
              strokeWidth={3}
              className="absolute z-0 text-zinc-800"
            />
          )}
          {abstract.releaseDate.status === "more" && (
            <ArrowUp
              size="100%"
              strokeWidth={3}
              className="absolute z-0 text-zinc-800"
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AbstractLineComponent;
