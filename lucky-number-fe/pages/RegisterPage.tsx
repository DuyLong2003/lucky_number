import React, { useState } from "react";
import { registerTenant } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }
        if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            setError("Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số.");
            return;
        }

        setIsLoading(true);

        try {
            await registerTenant({ name, email, password });
            setSuccess(true);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Đăng ký thất bại. Vui lòng thử lại!";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="bg-red-800 border-4 border-yellow-500 rounded-3xl p-8 shadow-2xl w-full text-center">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-tighter mb-4">
                        Tạo tài khoản Thành Công!
                    </h2>
                    <p className="text-yellow-100 mb-2 font-bold">
                        Tài khoản: <span className="text-yellow-400">{email}</span>
                    </p>
                    <p className="text-yellow-200/80 text-sm mb-8">
                        Vui lòng lưu lại thông tin để đăng nhập.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full px-6 py-4 bg-yellow-500 rounded-2xl font-black text-red-900 text-lg uppercase tracking-tighter shadow-[0_8px_0_rgb(180,83,9)] active:shadow-none active:translate-y-2 transition-all hover:scale-105"
                    >
                        Đến trang Đăng Nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-surface border-4 border-primary rounded-2xl p-8 shadow-2xl w-full relative overflow-hidden transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">
                        Đăng ký
                    </h2>
                    <p className="text-text-muted text-sm mt-2 font-medium uppercase tracking-widest">
                        Tạo tài khoản mới
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-primary font-bold text-xs mb-2 uppercase tracking-widest opacity-80">
                            Tên Công Ty / Tổ Chức
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            placeholder="VD: Công ty TNHH ABC..."
                            required
                            className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main placeholder-text-muted/40 focus:outline-none focus:border-primary transition-all shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="block text-primary font-bold text-xs mb-2 uppercase tracking-widest opacity-80">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@company.com"
                            disabled={isLoading}
                            required
                            className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main placeholder-text-muted/40 focus:outline-none focus:border-primary transition-all shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="block text-primary font-bold text-xs mb-2 uppercase tracking-widest opacity-80">
                            Mật Khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự"
                                disabled={isLoading}
                                required
                                minLength={8}
                                className="w-full bg-background border-2 border-primary/20 rounded-xl pl-4 pr-12 py-3 text-text-main placeholder-text-muted/40 focus:outline-none focus:border-primary transition-all shadow-inner font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/60 hover:text-primary transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                            <p className="text-primary text-sm font-bold uppercase tracking-tighter">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-black text-lg uppercase tracking-widest shadow-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-black/20"
                    >
                        {isLoading && (
                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? "Đang Khởi Tạo..." : "Tạo tài khoản"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-primary/10 text-center text-sm text-text-muted">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-primary hover:underline font-black uppercase ml-1 transition-all">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};