import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await forgotPassword(email);
            setMessage('Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex-1 flex items-center justify-center p-4 min-h-[80vh]">
            <div className="bg-surface border-4 border-primary rounded-2xl p-8 shadow-2xl w-full max-w-md relative overflow-hidden transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tighter mb-2">
                        Quên Mật Khẩu
                    </h2>
                    <p className="text-text-muted text-sm font-medium">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-600 p-4 rounded-xl mb-6 text-sm font-bold text-center">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-primary/10 border border-primary/30 text-primary p-4 rounded-xl mb-6 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-primary font-bold mb-2 uppercase tracking-widest text-xs opacity-80">
                            Địa Chỉ Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-all font-medium placeholder-text-muted/30 shadow-inner"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-black/20 flex justify-center items-center h-[60px]"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Gửi Yêu Cầu'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-primary/10 pt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary/60 hover:text-primary text-sm font-black uppercase transition-all tracking-widest"
                    >
                        &larr; Quay lại Đăng Nhập
                    </button>
                </div>
            </div>
        </div>
    );
};
