
import React from 'react';

interface Props {
  userData: {
    fullName: string;
    phoneNumber: string;
    luckyNumber: string;
  };
}

export const LuckyCard: React.FC<Props> = ({ userData }) => {
  return (
    <div className="bg-red-50 p-8 border-[12px] border-red-800 relative">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-600"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-yellow-600"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-yellow-600"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-600"></div>

      <div className="text-center">
        <div className="text-red-700 font-festive text-4xl mb-2">Chúc Mừng Năm Mới</div>
        <div className="text-red-900 font-black text-2xl uppercase tracking-[0.2em] mb-4">Bính Ngọ 2026</div>
        
        <div className="my-6 py-4 border-y-2 border-red-200">
          <p className="text-gray-600 text-xs uppercase font-bold tracking-widest mb-1">Họ và tên</p>
          <p className="text-red-800 text-xl font-bold">{userData.fullName}</p>
          
          <p className="text-gray-600 text-xs uppercase font-bold tracking-widest mt-4 mb-1">Số điện thoại</p>
          <p className="text-red-800 text-lg">{userData.phoneNumber}</p>
          
          <p className="text-gray-600 text-xs uppercase font-bold tracking-widest mt-4 mb-1">Đơn vị</p>
          <p className="text-red-800 text-lg">{userData.org}</p>
        </div>

        <div className="relative inline-block mt-4">
          <div className="absolute -inset-2 bg-yellow-400 blur opacity-30 rounded-full"></div>
          <div className="relative bg-gradient-to-br from-red-600 to-red-800 text-white px-10 py-6 rounded-2xl shadow-xl border-4 border-yellow-500">
            <p className="text-yellow-300 text-xs uppercase font-bold tracking-[0.3em] mb-2">Mã Số May Mắn</p>
            <p className="text-5xl font-black tracking-widest">{userData.luckyNumber}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center opacity-50 text-[10px] text-red-900 uppercase font-bold">
          <span>Ngày nhận: {new Date().toLocaleDateString('vi-VN')}</span>
          <span>Hệ thống Lộc Xuân 2026</span>
        </div>
      </div>

      {/* Background watermark icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[200px] pointer-events-none">
        🐎
      </div>
    </div>
  );
};
