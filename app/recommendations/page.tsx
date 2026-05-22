/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderContent } from '@/components/headers/MainHeader';
import { usePWAInstall } from '../hooks/usePWAInstall';
import axios from 'axios';

export default function RecommendationsPage() {
  const { canInstall, handleInstall } = usePWAInstall();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUser({ name: savedName });

    axios.get('/api/recommendations')
      .then(res => {
        const data = res.data.data || res.data;
        setRecommendations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const buildRoute = (from: string, to: string) => {
    sessionStorage.setItem('route_from', from);
    sessionStorage.setItem('route_to', to);
    router.push('/');
  };

  if (loading) return <div className="p-10 font-bold text-black">Загрузка рекомендаций...</div>;

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
          <h1 className="text-3xl uppercase">Рекомендуемые маршруты</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-white border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            К КАРТЕ
          </button>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-center text-xl uppercase">Нет маршрутов с рейтингом</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((route, idx) => (
              <div 
                key={route.id} 
                className="bg-white border-2 p-5 rounded-md shadow-sm relative"
              >
                <div className="absolute top-2 right-2 text-yellow-500 font-bold">★ {route.rating || 0}</div>
                <div className="mb-4 flex justify-between border-b-2 pb-2">
                  <span className="font-black">#{idx + 1}</span>
                  <span className="font-black text-blue-700 uppercase">{route.transport || 'auto'}</span>
                </div>

                <div className="space-y-2">
                  <p><span className="uppercase text-[10px] block">Откуда:</span> {route.from_name || route.from}</p>
                  <p><span className="uppercase text-[10px] block">Куда:</span> {route.to_name || route.to}</p>
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t">
                    <p><b>КМ:</b> {route.distance}</p>
                    <p><b>Время:</b> {route.duration}</p>
                  </div>
                </div>

                <button 
                  onClick={() => buildRoute(route.from_name || route.from, route.to_name || route.to)}
                  className="mt-4 w-full bg-black text-white py-2 hover:bg-gray-800 transition-colors"
                >
                  Построить маршрут
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}