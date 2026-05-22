'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function LoginPage({ setUser }: { setUser?: (user: any) => void }) {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await axios.post('/api/users/auth', data);

            if (res.data.status === "success") {
                localStorage.setItem('userId', res.data.data.id);
                localStorage.setItem('userName', data.login.toString());
                if (setUser) setUser(res.data.data);
                
                window.location.href = "/"; 
            } else {
                setError(res.data.message || "Неверный логин или пароль");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка сервера");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Вход в систему</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
                    <input name="login" placeholder="Логин" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    <input name="password" type="password" placeholder="Пароль" required className="border p-2 rounded text-sm outline-none focus:border-blue-500" />
                    
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-medium mt-2 transition">
                        Войти
                    </button>
                </form>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t text-center text-sm">
                    <button onClick={() => router.push('/auth/register')} className="text-blue-500 hover:underline cursor-pointer">
                        Нет аккаунта? Зарегистрироваться
                    </button>
                    <button onClick={() => router.push('/')} className="text-gray-500 hover:underline text-xs cursor-pointer">
                        На главную
                    </button>
                </div>
            </div>
        </main>
    );
}
