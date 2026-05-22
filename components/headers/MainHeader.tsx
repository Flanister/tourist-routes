import React, { useState } from 'react';
import { UserMenu } from '@/components/user/MenuForUser';
import { ChevronDown } from 'lucide-react';

interface HeaderContentProps {
  canInstall: boolean;
  handleInstall: () => void;
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
}

export const HeaderContent = ({ canInstall, handleInstall, user, setUser }: HeaderContentProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navLinks = [
    { name: 'Маршруты', href: '/routes' },
    { name: 'Рекомендации', href: '/recommendations' },
    { name: 'О нас', href: '/about' },
    { name: 'Соглашения', href: '/terms' },
  ];

  return (
    <header className="p-4 border-b border-gray-100 shadow-sm shrink-0 bg-white relative z-50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative group">
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            onBlur={() => setTimeout(() => setIsNavOpen(false), 200)}
            className="flex items-center gap-2 text-xl md:text-2xl font-bold hover:text-blue-600 transition-colors"
          >
            ТУРИСТИЧЕСКИЕ МАРШРУТЫ
            <ChevronDown className={`w-5 h-5 transition-transform ${isNavOpen ? 'rotate-180' : ''}`} />
          </button>

          {isNavOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto sm:flex-col md:flex-row">
          <button 
            onClick={handleInstall}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold transition-all active:scale-95"
          >
            {canInstall ? 'Установить' : 'Инфо'}
          </button>

          <UserMenu user={user} setUser={setUser} />
        </div>
      </div>
    </header>
  );
};
