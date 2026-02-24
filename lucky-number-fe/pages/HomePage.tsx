import React, { useState, useCallback } from 'react';
import { RegistrationForm } from '../components/RegistrationForm';
import { ResultModal } from '../components/ResultModal';
import confetti from 'canvas-confetti';
import { registerParticipant } from '../services/api';

interface UserData {
  fullName: string;
  phoneNumber: string;
  luckyNumber: string;
}

export const HomePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetNumber = useCallback(async (name: string, phone: string, org: string, onSuccess: () => void) => {
    try {
      const response = await registerParticipant({
        fullName: name,
        phoneNumber: phone,
        org,
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
        colors: ['#FFD700', '#FF0000', '#FFFFFF'],
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error registering participant:', error);
      const errorMessage = error.response?.data?.message || 'Không thể đăng ký. Vui lòng thử lại!';
      alert(errorMessage);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-md w-full bg-red-800 border-4 border-yellow-500 rounded-3xl p-8 shadow-2xl relative mt-4">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-red-900 px-6 py-2 rounded-full font-black text-lg shadow-xl whitespace-nowrap border-b-4 border-yellow-700">
          NHẬN LỘC ĐẦU XUÂN
        </div>

        <RegistrationForm onSubmit={handleGetNumber} />

        <div className="mt-8 text-center text-yellow-200 text-sm italic">
          "Chúc mừng năm mới Bính Ngọ 2026 - Vạn sự như ý"
        </div>
      </div>

      {isModalOpen && userData && (
        <ResultModal userData={userData} onClose={closeModal} />
      )}
    </>
  );
};
