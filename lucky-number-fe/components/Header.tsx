import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 text-center bg-gradient-to-b from-red-800 to-red-900 shadow-xl border-b-2 border-yellow-600">
      <div className="container mx-auto px-4">
        <h1 className="font-festive text-5xl md:text-7xl text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2 animate-float">
          Xuân Bính Ngọ 2026
        </h1>
        <p className="text-yellow-200 text-lg md:text-xl font-bold tracking-widest uppercase">
          ✦ Quay số trúng thưởng ✦
        </p>
        <p className="text-yellow-200 text-lg md:text-xl font-bold tracking-widest uppercase">
          Chương trình gặp mặt cuối năm
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="text-2xl">🌸</span>
          <div className="h-0.5 w-48 bg-yellow-500 self-center"></div>
          <span className="text-2xl">🌸</span>
        </div>
      </div>
    </header>
  );
};
