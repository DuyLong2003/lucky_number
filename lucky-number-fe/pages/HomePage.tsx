import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';
import { ResultModal } from '../components/ResultModal';
import { PaywallModal } from '../components/PaywallModal';
import confetti from 'canvas-confetti';
import { registerParticipant, getTenantConfig, TenantConfig } from '../services/api';
import { getThemeCSS } from '../src/utils/themeGen';

interface UserData {
  fullName: string;
  phoneNumber: string;
  luckyNumber: string;
  org?: string;
}

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenant') || '';
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [config, setConfig] = React.useState<TenantConfig | null>(null);

  React.useEffect(() => {
    if (tenantId) {
      getTenantConfig(tenantId).then(setConfig).catch(console.error);
    }
  }, [tenantId]);

  const handleGetNumber = useCallback(async (name: string, phone: string, org: string, onSuccess: () => void) => {
    try {
      if (!tenantId) {
        alert('Đường dẫn không hợp lệ. Thiếu thông tin Mã sự kiện (Tenant ID).');
        return;
      }
      const response = await registerParticipant({
        fullName: name,
        phoneNumber: phone,
        org,
        userId: tenantId
      });

      setUserData({
        fullName: response.fullName,
        phoneNumber: response.phoneNumber,
        luckyNumber: response.luckyNumber,
        org: response.org
      });

      setIsModalOpen(true);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: config?.brandColor ? [config.brandColor, '#FFFFFF'] : ['#FFD700', '#FF0000', '#FFFFFF'],
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error registering participant:', error);
      if (error.response?.status === 403) {
        setIsPaywallOpen(true);
      } else {
        const errorMessage = error.response?.data?.message || 'Không thể đăng ký. Vui lòng thử lại!';
        alert(errorMessage);
      }
    }
  }, [tenantId, config?.brandColor]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {config?.brandColor && (
        <style dangerouslySetInnerHTML={{ __html: getThemeCSS(config.brandColor) }} />
      )}      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background transition-colors duration-500">
        {config?.customLogoUrl && (
          <div className="flex justify-center mb-6">
            <img src={config.customLogoUrl} alt="Logo" className="h-20 object-contain drop-shadow-lg" />
          </div>
        )}
        <div
          className="max-w-md w-full bg-surface border-4 border-primary rounded-3xl p-8 shadow-2xl relative mt-4 transition-all duration-500"
        >
          <div
            className="absolute -top-10 left-1/2 -track-wide -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-lg shadow-xl whitespace-nowrap border-b-4 border-black/20 transition-all duration-500"
          >
            NHẬN LỘC ĐẦU XUÂN
          </div>

          <RegistrationForm onSubmit={handleGetNumber} />

          <div className="mt-8 text-center text-text-main text-sm italic">
            "Chúc mừng năm mới Bính Ngọ 2026 - Vạn sự như ý"
            {config?.name && <div className="mt-2 font-bold text-primary">{config.name}</div>}
          </div>
        </div>

        {isModalOpen && userData && (
          <ResultModal userData={userData} onClose={closeModal} />
        )}

        {isPaywallOpen && (
          <PaywallModal onClose={() => setIsPaywallOpen(false)} />
        )}
      </div>
    </>
  );
};
