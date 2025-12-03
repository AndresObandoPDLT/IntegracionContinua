import { Router } from "express";
import { readDB, writeDB } from "../utils/db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

router.get("/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === Number(req.params.id));

  if (!product) return res.status(404).json({ error: "Product not found" });

  res.json(product);
});

router.post("/", (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    ...req.body
  };

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

router.put("/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === Number(req.params.id));

  if (index === -1) return res.status(404).json({ error: "Product not found" });

  db.products[index] = { ...db.products[index], ...req.body };
  writeDB(db);

  res.json(db.products[index]);
});

router.delete("/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === Number(req.params.id));

  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const removed = db.products.splice(index, 1);
  writeDB(db);

  res.json(removed[0]);
});

export default router;
