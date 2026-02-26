import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RegistrationForm } from '../components/RegistrationForm';
import { ResultModal } from '../components/ResultModal';
import { PaywallModal } from '../components/PaywallModal';
import confetti from 'canvas-confetti';
import { registerParticipant, getTenantConfig, TenantConfig } from '../services/api';

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
  }, [tenantId]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {config?.customLogoUrl && (
        <div className="flex justify-center mb-6">
          <img src={config.customLogoUrl} alt="Logo" className="h-20 object-contain drop-shadow-lg" />
        </div>
      )}
      <div
        className="max-w-md w-full bg-red-800 border-4 rounded-3xl p-8 shadow-2xl relative mt-4 transition-colors"
        style={{ borderColor: config?.brandColor || '#EAB308' }}
      >
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-red-900 px-6 py-2 rounded-full font-black text-lg shadow-xl whitespace-nowrap border-b-4 transition-colors"
          style={{ backgroundColor: config?.brandColor || '#EAB308', borderColor: 'rgba(0,0,0,0.2)' }}
        >
          NHẬN LỘC ĐẦU XUÂN
        </div>

        <RegistrationForm onSubmit={handleGetNumber} />

        <div className="mt-8 text-center text-yellow-200 text-sm italic">
          "Chúc mừng năm mới Bính Ngọ 2026 - Vạn sự như ý"
          {config?.name && <div className="mt-2 font-bold">{config.name}</div>}
        </div>
      </div>

      {isModalOpen && userData && (
        <ResultModal userData={userData} onClose={closeModal} />
      )}

      {isPaywallOpen && (
        <PaywallModal onClose={() => setIsPaywallOpen(false)} />
      )}
    </>
  );
};
