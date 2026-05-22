'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await axios.post('/api/users/register', data);

            if (res.data.status === "success") {
                router.push('/auth/login');
            } else {
                setError(res.data.message || "Ошибка регистрации");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Сервер не отвечает");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Регистрация</h2>
                
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
                    <input name="firstName" placeholder="Имя" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="lastName" placeholder="Фамилия" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="middleName" placeholder="Отчество" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="dateBirth" type="number" placeholder="Год рождения" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="country" placeholder="Страна" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="login" placeholder="Логин" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="password" type="password" placeholder="Пароль" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-medium mt-2 transition">
                        Создать аккаунт
                    </button>
                </form>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t text-center text-sm">
                    <button onClick={() => router.push('/auth/login')} className="text-blue-500 hover:underline cursor-pointer">
                        Уже есть аккаунт? Войти
                    </button>
                    <button onClick={() => router.push('/')} className="text-gray-500 hover:underline text-xs cursor-pointer">
                        На главную
                    </button>
                </div>
            </div>
        </main>
    );
}
