import request from "supertest";
import express from "express";
import productsRoute from "./routes/products.js";
import { writeDB } from "./utils/db.js";

beforeEach(() => {
  writeDB({ products: [] });
});

const app = express();
app.use(express.json());
app.use("/products", productsRoute);

describe("Products API", () => {

  it("1. GET /products should return an empty array", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("2. POST /products should create a product", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Test Product" });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Product");
  });

  it("3. GET /products/:id should return a product", async () => {
    const created = await request(app)
      .post("/products")
      .send({ name: "Item" });

    const res = await request(app)
      .get(`/products/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Item");
  });

  it("4. PUT /products/:id should update a product", async () => {
    const created = await request(app)
      .post("/products")
      .send({ name: "Old Name" });

    const res = await request(app)
      .put(`/products/${created.body.id}`)
      .send({ name: "New Name" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("New Name");
  });

  it("5. DELETE /products/:id should remove a product", async () => {
    const created = await request(app)
      .post("/products")
      .send({ name: "Delete Me" });

    const res = await request(app)
      .delete(`/products/${created.body.id}`);

    expect(res.statusCode).toBe(200);

    const check = await request(app).get("/products");
    expect(check.body.length).toBe(0);
  });

});
