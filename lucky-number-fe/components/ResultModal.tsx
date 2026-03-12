
import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { LuckyCard } from './LuckyCard';

interface Props {
  userData: {
    fullName: string;
    phoneNumber: string;
    luckyNumber: string;
  };
  onClose: () => void;
}

export const ResultModal: React.FC<Props> = ({ userData, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    if (cardRef.current === null) return;
    
    setIsCapturing(true);
    try {
      // Small delay to ensure styles are fully applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        // filter out potential problematic elements if needed
        filter: (node) => {
          // If we had external widgets or tracking pixels, we'd filter them here
          return true; 
        }
      });
      
      const link = document.createElement('a');
      link.download = `loc-xuan-2026-${userData.luckyNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi chụp màn hình:', err);
      alert('Có lỗi khi tự động lưu ảnh. Bạn vui lòng chụp màn hình điện thoại/máy tính để lưu lại mã số này nhé!');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-lg w-full">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-yellow-400 text-4xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        <div className="bg-surface rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
          {/* Card to be captured */}
          <div ref={cardRef}>
            <LuckyCard userData={userData} />
          </div>

          <div className="p-6 bg-background border-t-4 border-primary">
            <p className="text-text-main text-center text-sm mb-6 leading-relaxed bg-surface/50 p-3 rounded-lg border border-primary/20">
              💡 <strong>Lưu ý:</strong> Vui lòng chụp màn hình này hoặc nhấn nút lưu bên dưới để làm căn cứ đối chiếu khi trúng thưởng.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isCapturing ? 'Đang lưu...' : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Lưu Ảnh
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="bg-surface hover:bg-surface/80 text-primary-foreground font-bold py-3 px-4 rounded-xl border border-primary/30 transition-all active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
