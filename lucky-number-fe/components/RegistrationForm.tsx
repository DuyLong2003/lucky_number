
import React, { useState } from 'react';

interface Props {
  onSubmit: (name: string, phone: string) => Promise<void>;
}

export const RegistrationForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập Họ và tên');
      return;
    }
    if (!phone.trim() || !/^\d{10,11}$/.test(phone)) {
      setError('Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    if(!org.trim()) {
      setError('Vui lòng nhập Đơn vị');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(name, phone, org, () => {

        setName('');
        setPhone('');
        setOrg('');
      });
      // Reset form after successful submission
    } catch (err) {
      // Error is handled in parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-primary font-bold mb-2 uppercase text-xs tracking-wider">
          Họ và tên
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn..."
          className="w-full bg-background border-2 border-primary/30 rounded-xl px-4 py-3 text-text-main placeholder-red-300/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-primary font-bold mb-2 uppercase text-xs tracking-wider">
          Số điện thoại
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="090x xxx xxx"
          className="w-full bg-background border-2 border-primary/30 rounded-xl px-4 py-3 text-text-main placeholder-red-300/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-primary font-bold mb-2 uppercase text-xs tracking-wider">
         Đơn vị
        </label>
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Nhập đơn vị của bạn..."
          className="w-full bg-background border-2 border-primary/30 rounded-xl px-4 py-3 text-text-main placeholder-red-300/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {error && (
        <p className="text-primary text-sm text-center bg-surface/50 py-2 rounded-lg border border-primary/30">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-xl shadow-xl transform active:scale-95 transition-all uppercase tracking-widest text-lg border-b-4 border-primary/70 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang xử lý...' : 'Lấy Số May Mắn'}
      </button>
    </form>

  );
};
