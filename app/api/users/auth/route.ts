import { getDB } from "../../db/db";
import { sendError, sendSuccess } from "../../responses/responses";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { login, password } = await req.json();

        if (!login || !password) {
            return sendError("Введите логин и пароль");
        }

        const db = await getDB();

        const user = await db.get(
            'SELECT id, password FROM users WHERE login = ?',
            [login]
        );

        await db.close();

        if (!user) {
            return sendError("Неверные логин или пароль");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return sendError("Неверные логин или пароль");
        }

        return sendSuccess({ id: user.id, message: "Успешная авторизация" });

    } catch (err) {
        console.error(err, "Failed!");
        return sendError("Ошибка с сервером");
    }
}
