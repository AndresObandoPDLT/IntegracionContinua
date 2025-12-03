import fs from "node:fs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "src", "data", "db.json");

export function readDB() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

export function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
