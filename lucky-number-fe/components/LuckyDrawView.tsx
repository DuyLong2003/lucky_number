
import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { getParticipants, drawWinner, resetDraw, Participant, isAuthenticated, getUserIdFromToken, getTenantConfig, TenantConfig } from '../services/api';
import { PaywallModal } from './PaywallModal';
import { getThemeCSS } from '../src/utils/themeGen';
export const LuckyDrawView: React.FC = () => {
  const [remainingCount, setRemainingCount] = useState<number>(0);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState("00000");
  const [isRolling, setIsRolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const navigate = useNavigate();

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const userId = getUserIdFromToken();
      if (userId) {
        try {
          const tenantConfig = await getTenantConfig(userId);
          setConfig(tenantConfig);
        } catch (e) { console.error('Failed to load config', e); }
      }

      const remainingResponse = await getParticipants({ isWinner: false, limit: 1000 });
      setRemainingCount(remainingResponse.totalResults);

      const winnersResponse = await getParticipants({ isWinner: true, limit: 1000, sortBy: 'winOrder:asc' });
      setWinners(winnersResponse.results);
    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.response?.status === 403) {
        setIsPaywallOpen(true);
      } else if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Không thể tải dữ liệu. Vui lòng thử lại!');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [loadData, navigate]);

  const startDraw = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (remainingCount === 0) {
      alert("Đã quay hết danh sách số!");
      return;
    }

    setIsRolling(true);

    const duration = 6000;
    const startTime = Date.now();

    const rollInterval = setInterval(() => {
      const temp = Math.floor(10000 + Math.random() * 90000).toString();
      setCurrentDisplay(temp);

      if (Date.now() - startTime > duration) {
        clearInterval(rollInterval);
        finalizeDraw();
      }
    }, 50);

    const finalizeDraw = async () => {
      try {
        const winner = await drawWinner();
        console.log('Draw winner result:', winner);

        if (!winner || !winner.luckyNumber) {
          throw new Error('Invalid response from server');
        }

        // Ensure luckyNumber is a string with 5 digits
        const luckyNumber = String(winner.luckyNumber).padStart(5, '0');

        setCurrentDisplay(luckyNumber);
        setWinners(prev => [...prev, winner]);
        // Decrease remaining count by 1
        setRemainingCount(prev => Math.max(0, prev - 1));
        setIsRolling(false);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: config?.brandColor ? [config.brandColor, '#FFFFFF'] : ['#FFD700', '#FF0000', '#FFFFFF']
        });
      } catch (error: any) {
        console.error('Error drawing winner:', error);
        console.error('Error details:', error.response?.data);
        if (error.response?.status === 403) {
          setIsPaywallOpen(true);
        } else if (error.response?.status === 401) {
          navigate('/login');
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Không thể quay số. Vui lòng thử lại!';
          alert(errorMessage);
        }
        setIsRolling(false);
        setCurrentDisplay("00000");
      }
    };
  }, [remainingCount, config?.brandColor, navigate]);

  const handleReset = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn reset danh sách quay? Tất cả người trúng thưởng sẽ được đưa về trạng thái chưa trúng.")) {
      try {
        await resetDraw();
        await loadData();
        setCurrentDisplay("00000");
        alert("Đã reset thành công!");
      } catch (error: any) {
        console.error('Error resetting draw:', error);
        if (error.response?.status === 403) {
          setIsPaywallOpen(true);
        } else if (error.response?.status === 401) {
          navigate('/login');
        } else {
          alert('Không thể reset. Vui lòng thử lại!');
        }
      }
    }
  };

  const getRankBadge = (rank: number) => {
    return null;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl w-full text-center">
        <div className="bg-surface border-4 border-primary rounded-3xl p-16 shadow-2xl">
          <p className="text-primary text-xl">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {config?.brandColor && (
        <style dangerouslySetInnerHTML={{ __html: getThemeCSS(config.brandColor) }} />
      )}
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background transition-colors duration-500">
        {/* Floating Back Button */}
        <div className="absolute top-6 left-6 z-50">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-black/30 hover:bg-black/50 text-primary hover:text-primary/80 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-xl transition-all shadow-lg font-bold text-sm tracking-widest uppercase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10 mt-12 md:mt-0">
          {/* Main Draw Area */}
          <div
            className="md:col-span-2 bg-surface border-4 border-primary rounded-3xl p-8 shadow-2xl relative transition-all duration-500"
          >
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1 rounded-full font-bold shadow-lg uppercase text-sm transition-all duration-500"
            >
              Bảng Quay Số
            </div>

            <div className="text-center py-12">
              {config?.customLogoUrl && (
                <div className="flex justify-center mb-8">
                  <img src={config.customLogoUrl} alt="Custom Logo" className="h-24 object-contain drop-shadow-2xl" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-primary mb-8 uppercase tracking-widest">
                Quay Số Trúng Thưởng
              </h2>

              <div className="relative inline-block mb-10">
                <div className="absolute -inset-4 bg-primary blur opacity-20 rounded-2xl"></div>
                <div className="relative bg-background border-8 border-primary/50 rounded-2xl px-5 md:px-12 py-10 shadow-inner flex gap-2">
                  {currentDisplay.split('').map((digit, i) => (
                    <div
                      key={i}
                      className={`md:w-14 md:h-20 w-10 h-16 flex items-center justify-center bg-primary text-primary-foreground text-2xl md:text-5xl font-black rounded-lg shadow-lg border-b-4 border-black/20 transition-all duration-75 ${isRolling ? 'animate-pulse' : ''}`}
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startDraw}
                  disabled={isRolling || remainingCount === 0}
                  className={`group relative px-12 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-xl uppercase tracking-tighter shadow-[0_8px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 disabled:translate-y-2 disabled:shadow-none`}
                >
                  {isRolling ? 'Đang quay...' : 'Quay Số May Mắn'}
                  {!isRolling && remainingCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                      {remainingCount}
                    </span>
                  )}
                </button>

                <p className="mt-4 text-text-main/70 text-sm">
                  Còn lại: <strong>{remainingCount}</strong> số trong danh sách
                </p>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-background/50 border-2 border-primary/30 rounded-3xl p-6 h-full flex flex-col backdrop-blur-md">
            <h3 className="text-primary font-bold uppercase text-xs tracking-widest mb-4 border-b border-primary/20 pb-2 flex justify-between">
              <span>Lịch sử trúng giải</span>
              <span className="text-primary/60">{winners.length}</span>
            </h3>

            <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[400px]">
              {winners.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic text-sm text-text-main">
                  Chưa có số nào được quay
                </div>
              ) : (
                winners.map((winner, idx) => (
                  <div
                    key={winner.id}
                    className="flex items-center justify-between p-3 rounded-xl animate-slideInRight transition-all bg-surface/80 border border-primary/20 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-lg font-bold tracking-wider text-text-main">
                          {winner.luckyNumber}
                        </span>
                        <span className="text-[13px] font-semibold text-primary">
                          {winner.fullName}
                        </span>
                        <span className="text-[11px] font-bold text-text-muted">
                          {winner.phoneNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-text-muted">
                          {winner.org}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-primary/20">
              <button
                onClick={handleReset}
                className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold tracking-tighter transition-colors"
              >
                Làm mới danh sách
              </button>
            </div>
          </div>
        </div>

        {isPaywallOpen && (
          <PaywallModal onClose={() => setIsPaywallOpen(false)} />
        )}
      </div>
    </>
  );
};

