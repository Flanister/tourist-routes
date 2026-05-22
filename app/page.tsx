'use client';

import React, { useEffect, useState } from 'react';
import Map from '@/components/map/map';
import { usePWAInstall } from './hooks/usePWAInstall';
import GetApi from '@/components/map/ImportApiKey';
import { HeaderContent } from '@/components/headers/MainHeader';

export default function HomePage() {

  const { canInstall, handleInstall } = usePWAInstall();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedName) setUser({ name: savedName });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900">
      <GetApi />

      <HeaderContent
        canInstall={canInstall}
        handleInstall={handleInstall}
        user={user}
        setUser={setUser}
      />

      <main className="flex-1 w-full h-full relative overflow-hidden">

        <Map />
        
        {/* Оповещалка для юзера */}
        <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none z-20">
          <p className="max-w-fit mx-auto bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-[11px] text-gray-500 shadow-sm">
            *Если не ставится, ищи в меню браузера &quot;На экран Домой&quot;
          </p>
        </div>

      </main>
    </div>
  );
}
