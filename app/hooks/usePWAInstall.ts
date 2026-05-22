import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (prompt) {
      await prompt.prompt();
      setPrompt(null);
    } 
    else {
      alert('На iPhone: нажмите "Поделиться" -> "На экран Домой"');
    }
  };

  return { 
    canInstall: !!prompt, 
    handleInstall 
  };
};
