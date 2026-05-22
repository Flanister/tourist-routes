import { NextResponse } from "next/server";
import { getDB } from "../../db/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID не передан" }, { status: 400 });

        const db = await getDB();
        
        const user = await db.get(`
            SELECT 
                u.login, 
                p.firstName, 
                p.middleName, 
                p.lastName, 
                p.dateBirth, 
                p.country 
            FROM users u
            INNER JOIN user_profiles p ON u.id = p.user_id 
            WHERE u.id = ?`, 
            [id]
        );

        await db.close();

        if (!user) {
            return NextResponse.json({ error: "Профиль не найден в базе" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}
