import { getDB } from "../../db/db";
import { sendError, sendSuccess } from "../../responses/responses";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, middleName, lastName, login, password, dateBirth, country } = body;

        if (!firstName || !middleName || !lastName || !login || !password || !dateBirth || !country) {
            return sendError("Нужно заполнить все поля");
        }

        if (login.length < 6) { 
            return sendError("Логин должен быть от 6 символов");
        }

        if (password.length < 8) { 
            return sendError("Пароль должен быть от 8 символов");
        }

        const db = await getDB();
        await db.get("PRAGMA foreign_keys = ON");

        const existingUser = await db.get(
            'SELECT login FROM users WHERE login = ?',
            [login]
        );
        
        if (existingUser) {
            await db.close();
            return sendError("Логин занят");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await db.run(
        'INSERT INTO users (login, password, role) VALUES (?, ?, ?)',
        [login, hashedPassword, 'user']
        );

        const userId = userResult.lastID;

        await db.run(
            `INSERT INTO user_profiles (user_id, firstName, middleName, lastName, dateBirth, country) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, firstName, middleName, lastName, dateBirth, country]
        );

        await db.close();
        return sendSuccess();

    } catch (err) {
        console.error(err);
        return sendError("Ошибка при регистрации");
    }
}
