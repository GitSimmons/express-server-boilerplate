const request = require("supertest");
import { app } from "../src/app";

describe("API tests", () => {
  it("should send 200 OK to GET root", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
  describe("/addition", () => {
    it("should add two numbers", async () => {
      const response = await request(app)
        .get("/addition")
        .query({ a: "2", b: "3" });
      expect(response.status).toBe(200);
      expect(response.text).toBe("5");
    });
    it("should send a 400 when adding things that are not numbers", async () => {
      const response = await request(app).get("/addition").query({
        a: "abc",
        b: "def",
      });
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Bad Request/);
    });
  });
  describe("/memory", () => {
    it("should add values to memory and be able to recall them", async () => {
      const putResponse = await request(app).put("/memory").send("a=4&b=5");
      expect(putResponse.status).toBe(201);
      expect(putResponse.body).toMatchObject({
        a: "4",
        b: "5",
      });
      const response = await request(app).get("/memory");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        a: "4",
        b: "5",
      });
    });
    it("should get a single key from memory", async () => {
      const putResponse = await request(app).put("/memory").send("a=4&b=5");
      expect(putResponse.status).toBe(201);
      const response = await request(app).get("/memory/a");
      expect(response.status).toBe(200);
      expect(response.text).toBe("4");
    });
    it("should return 404 when getting a nonexistent memory", async () => {
      const response = await request(app).get("/memory/test");
      console.log(response.text);
      expect(response.status).toBe(404);
    });
  });
});
