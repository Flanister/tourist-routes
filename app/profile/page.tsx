/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [info, setInfo] = useState<any>(null);
  const [myRoutes, setMyRoutes] = useState<any[]>([]);
  const router = useRouter();

  // Загрузка профиля
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/auth/login');
      return;
    }
    axios.get(`/api/users/profile?id=${id}`)
      .then(res => setInfo(res.data))
      .catch(() => router.push('/'));
  }, [router]);

  if (!info) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p>Загрузка...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Мой профиль</h1>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Имя:</span>
            <span className="font-medium text-black">{info.firstName} {info.lastName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Страна:</span>
            <span className="font-medium text-black">{info.country}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Дата рождения:</span>
            <span className="font-medium text-black">{info.dateBirth}</span>
          </div>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
        >
          На главную
        </button>
      </div>
    </div>
  );
}