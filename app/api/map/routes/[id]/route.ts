import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbPath = path.join(process.cwd(), 'routes.sqlite');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    
    const result = await db.run('DELETE FROM routes WHERE id = ?', [id]);
    await db.close();

    return NextResponse.json({ 
      status: "success", 
      message: `Удалено строк: ${result.changes}` 
    });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { status: "error", message: "Ошибка удаления маршрута" },
      { status: 500 }
    );
  }
}