/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { HeaderContent } from '@/components/headers/MainHeader';
import { usePWAInstall } from '../hooks/usePWAInstall';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AllRoutesPage() {
  const { canInstall, handleInstall } = usePWAInstall();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [allRoutes, setAllRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUser({ name: savedName });

    axios.get('/api/map/routes/all')
      .then(res => {
        setAllRoutes(res.data.data || []);
        setAllRoutes(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 font-bold text-black">Загрузка данных...</div>;

  return (
    <div className="bg-gray-200 min-h-screen font-sans text-black">
      <HeaderContent 
        canInstall={canInstall} 
        handleInstall={handleInstall} 
        user={user} 
        setUser={setUser} 
      />

      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl uppercase">Список маршрутов</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-white border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            ВЕРНУТЬСЯ К КАРТЕ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRoutes.map((route) => (
            <div 
              key={route.id} 
              className="bg-white border-2 p-5 rounded-md shadow-sm"
            >
              <div className="mb-4 flex justify-between border-b-2 pb-2">
                <span className="font-black">ID: {route.id}</span>
                <span className="font-black text-blue-700 uppercase">{route.transport}</span>
              </div>

              <div className="space-y-2">
                <p className="leading-tight">
                  <span className="uppercase text-[10px] block">Пункт А:</span> 
                  <span>{route.from_name || route.from}</span>
                </p>
                <p className="leading-tight">
                  <span className="uppercase text-[10px] block">Пункт Б:</span> 
                  <span>{route.to_name || route.to}</span>
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t">
                  <p><b>КМ:</b> {route.distance}</p>
                  <p><b>ВРЕМЯ:</b> {route.duration}</p>
                </div>
              </div>

              <div className="my-4 border p-2">
                <p className=" text-xs uppercase">Автор: {route.login || 'Анонимус'}</p>
              </div>
              <p className="leading-tight">
                  <span className="uppercase text-[10px] block">Дата создания:</span> 
                  <span>{route.created_at}</span>
              </p>
            </div>
          ))}
        </div>

        {allRoutes.length === 0 && (
          <p className="mt-10 text-center text-xl uppercase">Маршруты не найдены в базе данных</p>
        )}
      </div>
    </div>
  );
}
