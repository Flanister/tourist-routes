/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const UserMenu = ({ user, setUser }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) {
    return <button onClick={() => router.push('/auth/register')} className="...">Регистрация</button>;
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-lg font-bold border border-blue-100"
      >
        {user.name} ▾
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <button 
            onClick={() => router.push('/profile')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Мой профиль
          </button>
          <button 
            onClick={() => {
                localStorage.clear();
                setUser(null);
                router.push('/');
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
