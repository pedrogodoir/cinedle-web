type NumericField = {
  max: number | null;
  min: number | null;
  status: string;
};

type ItemArray = {
  values: string[];
  status: string;
};
type AbstractLine = {
  releaseDate: NumericField;
  budget: NumericField;
  genres: ItemArray;
  companies: ItemArray;
  directors: ItemArray;
  actors: ItemArray;
};
