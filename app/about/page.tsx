/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { HeaderContent } from '@/components/headers/MainHeader';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const { canInstall, handleInstall } = usePWAInstall();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUser({ name: savedName });
  }, []);

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
          <h1 className="text-3xl uppercase">О проекте</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-white border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            К КАРТЕ
          </button>
        </div>

        <div className="bg-white border-2 p-8 rounded-md shadow-sm space-y-4">
          <p>
            <strong>Туристические маршруты</strong> — это платформа, созданная для путешественников, которые хотят открывать новые направления, делиться впечатлениями и находить проверенные маршруты.
          </p>
          <p>
            Мы собрали лучшие треки по России и всему миру — от лёгких прогулок до многодневных походов. Каждый маршрут сопровождается описанием, картой и отзывами реальных людей.
          </p>
          <p>
            Наша цель — вдохновлять на активный отдых и делать планирование поездок простым и увлекательным.
          </p>
          <div className="border-t pt-4 mt-4">
            <p className="font-semibold">Контакты:</p>
            <p>Email: hello@tur-marshruty.ru</p>
            <p>Telegram: @tur_marshruty</p>
          </div>
        </div>
      </div>
    </div>
  );
}