import express from "express";
//const express = require("express");
// use a simple javascript oject to hold data in memory
const memory: any = {};

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("query parser", (queryString: string) => {
  return new URLSearchParams(queryString);
});

app.get("/", (_: any, res: any) => {
  res.status(200).send("GET /");
});
app.get("/addition", function ({ query: { a, b } }: any, res: any) {
  const result = parseInt(a) + parseInt(b);
  isNaN(result)
    ? res
        .status(400)
        .send(
          "Bad Request - Are you sure you specified two numbers? Did you forget to put the curl URL in quotes?"
        )
    : res.status(200).send(`${result}`);
});
app.get("/memory", (_, res) => {
  res.status(200).send(memory);
});
app.put("/memory", (req, res) => {
  for (const key in req.body) {
    memory[key] = req.body[key];
  }
  res.status(201).send(memory);
});

app.get("/memory/:key", (req, res) => {
  const { key } = req.params;
  if (memory[key] !== undefined) {
    res.status(200).send(memory[key]);
  } else {
    res.status(404).send("Key not found");
  }
});

export { app };
