/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const dbPath = path.join(process.cwd(), 'routes.sqlite');
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const routes = await db.all("SELECT * FROM routes ORDER BY id DESC");

        await db.close();
        
        return NextResponse.json({ status: "success", data: routes });
    } catch (e: any) {
        console.error("Route API Error:", e);
        return NextResponse.json({ 
            status: "error", 
            message: e.message 
        }, { status: 500 });
    }
}
