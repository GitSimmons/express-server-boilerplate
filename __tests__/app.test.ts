const request = require("supertest");
import { app } from "../src/app";

const arrayToSave = [
  { author: "Steve McConnell", name: "Code Complete", published: 1993 },
  {
    author: "Steve McConnell",
    name: "Rapid development",
    published: 1996,
  },
  {
    author: "Steve McConnell",
    name: "After the gold rush",
    published: 1999,
  },
  { author: "Martin Fowler", name: "Refactoring", published: 1999 },
  { author: "Martin Fowler", name: "UML distilled", published: 1997 },
];

describe("API tests", () => {
  describe("/save", () => {
    it("should save a JSON array to memory", async () => {
      const postResponse = await request(app).post("/save").send(arrayToSave);
      expect(postResponse.status).toBe(201);
      expect(postResponse.text).toBe(JSON.stringify(arrayToSave));
    });
  });
  describe("/load", () => {
    it("should load the data saved to memory", async () => {
      const postResponse = await request(app).post("/save").send(arrayToSave);
      expect(postResponse.status).toBe(201);
      const response = await request(app).get("/load");
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(arrayToSave);
    });
  });
  describe("/search", () => {
    beforeAll(async () => {
      // add some sample data to memory
      const postResponse = await request(app).post("/save").send(arrayToSave);
      expect(postResponse.status).toBe(201);
    });

    it("should be able to search from exact text", async () => {
      const searchResponse = await request(app)
        .get("/search")
        .query({ exact_text: "Steve%20McConnell" });
      expect(searchResponse.status).toBe(200);
      expect(JSON.parse(searchResponse.text)).toEqual(
        arrayToSave.filter((book) => book.author === "Steve McConnell")
      );
    });
    it("should be able to search for partial matches", async () => {
      const searchResponse = await request(app)
        .get("/search")
        .query({ text: "Co" });
      expect(searchResponse.status).toBe(200);
      expect(JSON.parse(searchResponse.text)).toEqual(
        arrayToSave.filter((book) => book.author === "Steve McConnell")
      );
    });
    it("should be able to order by string fields", async () => {
      const searchResponse = await request(app)
        .get("/search")
        .query({ text: "Steve", order_by: "name" });
      expect(searchResponse.status).toBe(200);
      expect(JSON.parse(searchResponse.text)).toEqual([
        arrayToSave[2],
        arrayToSave[0],
        arrayToSave[1],
      ]);
    });
    it("should be able to order by number fields", async () => {
      const searchResponse = await request(app)
        .get("/search")
        .query({ text: "Steve", order_by: "published" });
      expect(searchResponse.status).toBe(200);
      expect(JSON.parse(searchResponse.text)).toEqual([
        arrayToSave[0],
        arrayToSave[1],
        arrayToSave[2],
      ]);
    });
    it("should not mutate memory when performing a search or sorting results", async () => {
      const searchResponse = await request(app).get("/search").query({
        text: "Steve",
        order_by: "published",
        sort_direction: "desc",
      });
      expect(searchResponse.status).toBe(200);
      const memory = await request(app).get("/load");
      expect(JSON.parse(memory.text)).toEqual(arrayToSave);
    });
    describe("/search?sort_direction='desc' should sort in descending order", () => {
      const cases = [
        // strings
        [
          {
            text: "Steve",
            order_by: "name",
            sort_direction: "desc",
          },
          [arrayToSave[1], arrayToSave[0], arrayToSave[2]],
        ],
        // numbers
        [
          {
            text: "Martin",
            order_by: "published",
            sort_direction: "desc",
          },
          [arrayToSave[3], arrayToSave[4]],
        ],
      ];
      test.each(cases)(
        "given %p, returns the correct order",
        async (query, expectedResult) => {
          const searchResponse = await request(app).get("/search").query(query);
          expect(searchResponse.status).toBe(200);
          expect(JSON.parse(searchResponse.text)).toEqual(expectedResult);
        }
      );
    });
  });
  describe("Test it with data of a different kind", () => {
    const someVeryDifferentData = [
      {
        method: "filter",
        ratio: "1:8",
        brew_time_in_seconds: 180,
      },
      {
        method: "espresso",
        ratio: "1:2",
        brew_time_in_seconds: 25,
      },
      {
        method: "inverted aeropress",
        ratio: "1:12",
        brew_time_in_seconds: 120,
      },
    ];
    describe("/save", () => {
      it("should save even with different data", async () => {
        const response = await request(app)
          .post("/save")
          .send(someVeryDifferentData);
        expect(response.status).toBe(201);
      });
    });
    describe("/load", () => {
      it("should load saved data", async () => {
        const saveResponse = await request(app)
          .post("/save")
          .send(someVeryDifferentData);
        expect(saveResponse.status).toBe(201);
        const loadResponse = await request(app).get("/load");
        expect(JSON.parse(loadResponse.text)).toEqual(someVeryDifferentData);
      });
    });
    describe("/search", () => {
      beforeAll(async () => {
        const response = await request(app)
          .post("/save")
          .send(someVeryDifferentData);
        expect(response.status).toBe(201);
      });
      it("search for exact text", async () => {
        const searchResponse = await request(app)
          .get("/search")
          .query({ exact_text: "espresso" });
        expect(searchResponse.status).toBe(200);
        expect(JSON.parse(searchResponse.text)).toEqual([
          someVeryDifferentData[1],
        ]);
      });
      it("sort in descending order", async () => {
        const searchResponse = await request(app).get("/search").query({
          text: "e", // genius, right?
          order_by: "brew_time_in_seconds",
          sort_direction: "desc",
        });
        expect(searchResponse.status).toBe(200);
        expect(JSON.parse(searchResponse.text)).toEqual([
          someVeryDifferentData[0],
          someVeryDifferentData[2],
          someVeryDifferentData[1],
        ]);
      });
    });
  });
});
