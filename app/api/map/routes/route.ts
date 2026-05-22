import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { sendError, sendSuccess } from "@/app/api/responses/responses";

async function getRoutesDB() {
  const dbPath = path.join(process.cwd(), 'routes.sqlite');
  return await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

async function initDB() {
  const db = await getRoutesDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_name TEXT,
      to_name TEXT,
      distance TEXT,
      duration TEXT,
      transport TEXT,
      favorite INTEGER DEFAULT 0,
      rating INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.close();
}
initDB();

export async function GET() {
  try {
    const db = await getRoutesDB();
    const routes = await db.all("SELECT * FROM routes ORDER BY created_at DESC");
    await db.close();
    return sendSuccess(routes);
  } catch (err) {
    console.error(err);
    return sendError("Ошибка при получении");
  }
}

export async function POST(req: Request) {
  try {
    const db = await getRoutesDB();
    const { from, to, distance, duration, transport, favorite, userId } = await req.json();

    if (!from || !to) return sendError("Укажите точки");

    const result = await db.run(
      `INSERT INTO routes (from_name, to_name, distance, duration, transport, favorite, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [from, to, distance || '', duration || '', transport || 'auto', favorite ? 1 : 0, userId || null]
    );

    await db.close();
    return sendSuccess({ id: result.lastID });
  } catch (err) {
    console.error(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const db = await getRoutesDB();
    const { id, from, to, distance, duration, transport, favorite } = await req.json();
    
    await db.run(
      `UPDATE routes SET from_name = ?, to_name = ?, distance = ?, duration = ?, transport = ?, favorite = ? WHERE id = ?`,
      [from, to, distance, duration, transport, favorite ? 1 : 0, id]
    );
    
    await db.close();
    return sendSuccess("Обновлено");
  } catch (err) {
    console.error(err);
    return sendError("Ошибка при обновлении");
  }
}