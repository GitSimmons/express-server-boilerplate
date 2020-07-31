import express from "express";

type BOOK = {
  author: string;
  name: string;
  published: number;
};

enum DIRECTION {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

let memory: BOOK[] = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("query parser", (queryString: string) => {
  return new URLSearchParams(queryString);
});

app.post("/save", (req, res) => {
  memory = req.body;
  res.status(201).json(memory);
});
app.get("/load", (_, res) => {
  res.status(200).json(memory);
});
app.get("/search", function (
  {
    query: { exact_text, text, order_by, sort_direction },
  }: {
    query: {
      exact_text: string;
      text: string;
      order_by: keyof BOOK;
      sort_direction: DIRECTION;
    };
  },
  res
) {
  type FIELD = keyof BOOK;
  let results: BOOK[] = [];
  // VALIDATORS:
  // ensure that something is being searched for
  if (!exact_text && !text) {
    res.status(400).json({
      error: "Please include a query parameter for either exact_text or text",
    });
  }
  // ensure that not both exact and partial search are being used
  if (exact_text && text) {
    res.status(400).json({
      error: "Can't search for both an exact match and partial match",
    });
  }
  // ensure that order_by is actually a field on the objects
  const fieldsOnObject = Object.keys(memory[0]);
  if (order_by && !fieldsOnObject.includes(order_by)) {
    res.status(400).json({ error: "Invalid order_by field" });
  }
  const sortByText = (memory: BOOK[], order_by: FIELD) =>
    memory.sort((a, b) => (a[order_by] > b[order_by] ? 1 : -1));
  const sortByNumber = (memory: BOOK[], order_by: FIELD) =>
    memory.sort((a, b) => a[order_by] - b[order_by]);
  const sortSearch = (
    results: BOOK[],
    order_by: FIELD,
    sort_direction: DIRECTION
  ) => {
    const orderedResults =
      typeof results[0][order_by] === "number"
        ? sortByNumber(results, order_by)
        : typeof results[0][order_by] === "string"
        ? sortByText(results, order_by)
        : results;
    return sort_direction === DIRECTION.DESCENDING
      ? orderedResults.reverse()
      : orderedResults;
  };
  // populate results based on exact text or partial text
  results = memory.filter((book: BOOK) =>
    Object.values(book).some(
      (field) =>
        field === decodeURI(exact_text) ||
        field.toString().includes(decodeURI(text))
    )
  );
  results
    ? res.status(200).json(sortSearch(results, order_by, sort_direction))
    : res.status(204).json({ error: "No Content Found" });
});

export { app };
