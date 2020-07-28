import request from "supertest";
import { app } from "./app";

describe("API tests", () => {
  it("should send 200 OK when querying root", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});
