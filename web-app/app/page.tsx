"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => await loadProducts();
    load()
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = { name, price: Number(price) };

    if (editingId) {
      await fetch(`${API_URL}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      setEditingId(null);
    } else {
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }

    setName("");
    setPrice("");
    loadProducts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Gestión de Productos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h2>{editingId ? "Editar producto" : "Crear producto"}</h2>

        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          />
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            style={{ padding: 8, marginRight: 8 }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "black",
              color: "white",
              border: "none",
            }}
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>

      <h2>Lista de productos</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ margin: "12px 0" }}>
              <strong>{p.name}</strong> – ${p.price}{" "}
              <button onClick={() => handleEdit(p)} style={{ marginLeft: 12 }}>
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{ marginLeft: 12, color: "red" }}
              >
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
