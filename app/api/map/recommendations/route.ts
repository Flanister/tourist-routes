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

export async function GET() {
    try {
        const db = await getRoutesDB();        
        const items = await db.all("SELECT * FROM routes ORDER BY rating DESC LIMIT 10");
        
        await db.close();
        return sendSuccess(items);
    } catch (err) {
        console.error(err);
        return sendError("Ошибка при получении рекомендаций");
    }
}
