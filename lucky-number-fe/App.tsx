import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DrawPage } from './pages/DrawPage';
import horseImage from './assets/imgs/horse.png';

const App: React.FC = () => {
  React.useEffect(() => {
    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(55, 31, 5, 0.5);
        border-radius: 2px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #fbbf24, #f59e0b);
        border-radius: 2px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #fcd34d, #fbbf24);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-red-900 text-yellow-100 flex flex-col relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🏮</div>
          <div className="absolute top-10 right-10 text-6xl">🏮</div>
          <div className="absolute bottom-10 left-10 text-6xl hidden lg:block">
            <img src={horseImage} className="w-[500px]" />
          </div>
          <div className="absolute bottom-10 right-10 text-6xl hidden lg:block">
            <img
              src={horseImage}
              className="w-[500px] transform -scale-x-100"
            />
          </div>
        </div>

        <Header />

        <main className="flex-grow flex items-center justify-center p-4 z-10 pb-20 pt-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/winners" element={<DrawPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
