"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const app = express_1.default();
exports.app = app;
// use a simple javascript oject to hold data in memory
const memory = {};
app.use(express_1.default.urlencoded({ extended: true }));
app.set("query parser", (queryString) => {
    return new URLSearchParams(queryString);
});
app.get("/", (_, res) => {
    console.log("GET ROOT");
    res.status(200).send("GET ROOT");
});
app.get("/addition", function ({ query: { a, b } }, res) {
    const result = parseInt(a) + parseInt(b);
    res.status(200).send(`${result}`);
});
