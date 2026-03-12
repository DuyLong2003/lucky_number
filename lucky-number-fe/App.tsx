import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DrawPage } from './pages/DrawPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import horseImage from './assets/imgs/horse.png';

const App: React.FC = () => {
  React.useEffect(() => {
    // Add custom scrollbar styles
    // Add custom scrollbar styles based on theme variables
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: hsl(var(--background));
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: hsl(var(--primary) / 0.5);
        border-radius: 3px;
        border: 1px solid hsl(var(--primary) / 0.2);
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--primary));
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-text-main flex flex-col relative overflow-hidden transition-colors duration-500">
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

        <main className="flex-grow flex items-start justify-center p-4 z-10 pb-20 pt-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/winners" element={<DrawPage />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/super-admin" element={<SuperAdminPage />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
