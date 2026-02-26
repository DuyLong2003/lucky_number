import React from 'react';

interface Props {
    onClose: () => void;
}

export const PaywallModal: React.FC<Props> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative max-w-md w-full">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-yellow-400 text-4xl"
                    aria-label="Đóng"
                >
                    &times;
                </button>

                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 bg-red-900 border-t-8 border-yellow-500 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4 uppercase tracking-widest">
                            Giới Hạn Truy Cập
                        </h2>
                        <p className="text-yellow-100 text-base mb-6 leading-relaxed">
                            Tài khoản của bạn đã hết hạn sử dụng hoặc vượt quá số lượng người chơi cho phép.
                        </p>
                        <div className="bg-red-950/50 p-4 rounded-xl border border-yellow-900/50 mb-6">
                            <p className="text-yellow-200 text-sm">
                                Vui lòng liên hệ Admin qua SĐT/Zalo:<br />
                                <strong className="text-xl text-yellow-400 mt-2 block tracking-widest">09xx.xxx.xxx</strong><br />
                                để mở khóa dịch vụ.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
