import React, { useState } from "react";
import { login, LoginRequest } from "../services/api";

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginRequest: LoginRequest = {
        email,
        password,
      };
      await login(loginRequest);
      setEmail("");
      setPassword("");
      onLoginSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-red-800 border-4 border-yellow-500 rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">
            Đăng Nhập
          </h2>
          <p className="text-yellow-200/70 text-sm mt-2">
            Vui lòng đăng nhập để tiếp tục quay số
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-400 font-bold text-sm mb-2 uppercase tracking-tighter">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email..."
              disabled={isLoading}
              required
              className="w-full bg-red-950 border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-yellow-100 placeholder-red-300 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-yellow-400 font-bold text-sm mb-2 uppercase tracking-tighter">
              Mật Khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              disabled={isLoading}
              required
              className="w-full bg-red-950 border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-yellow-100 placeholder-red-300 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-950 border-2 border-red-400 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-4 bg-yellow-500 rounded-2xl font-black text-red-900 text-lg uppercase tracking-tighter shadow-[0_8px_0_rgb(180,83,9)] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50 disabled:shadow-none hover:enabled:scale-105"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-6 py-3 border-2 border-yellow-400 text-yellow-400 rounded-xl font-bold uppercase tracking-tighter transition-all hover:enabled:bg-yellow-400/10 disabled:opacity-50"
            >
              Hủy
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
