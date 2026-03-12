import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserIdFromToken,
    getTenantConfig,
    updateTenantConfig,
    getParticipants,
    TenantConfig,
    Participant,
    logout
} from "../services/api";

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const userId = getUserIdFromToken();
    const [config, setConfig] = useState<TenantConfig | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [name, setName] = useState("");
    const [brandColor, setBrandColor] = useState("");
    const [customLogoUrl, setCustomLogoUrl] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (userId) {
            loadDashboardData(userId);
        } else {
            navigate('/login');
        }
    }, [userId, navigate]);

    const loadDashboardData = async (uid: string) => {
        try {
            setIsLoading(true);
            const [conf, parts] = await Promise.all([
                getTenantConfig(uid),
                getParticipants({ limit: 100 })
            ]);
            setConfig(conf);
            setName(conf.name || "");
            setBrandColor(conf.brandColor || "#FF0000");
            setCustomLogoUrl(conf.customLogoUrl || "");
            setParticipants(parts.results || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setIsUpdating(true);
        try {
            await updateTenantConfig(userId, { name, brandColor, customLogoUrl });
            alert("Cập nhật giao diện thành công!");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Lỗi khi cập nhật cấu hình.";
            alert(`Lỗi: ${errorMessage}`);
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const shareUrl = `${window.location.origin}/?tenant=${userId}`;

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Đã copy link chia sẻ!");
    };

    const handleLogout = async () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi Không gian Quản trị?")) {
            await logout();
            navigate('/login');
        }
    };

    if (isLoading) {
        return <div className="text-primary text-center py-20 animate-pulse font-bold">Đang tải dữ liệu Workspace...</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 relative">
            {/* Global Header Actions */}
            <div className="absolute -top-12 right-0 flex gap-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-primary/80 hover:text-red-400 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                </button>
            </div>

            {/* Header Area */}
            <div className="flex justify-between items-center bg-surface border-4 border-primary rounded-2xl p-6 shadow-xl">
                <div>
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">
                        Trang Quản Trị
                    </h1>
                    <p className="text-text-main mt-1">
                        Xin chào, <span className="font-bold">{config?.name || 'Đối tác'}</span>
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => navigate('/winners')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-black text-xl uppercase shadow-lg active:scale-95 transition-all select-none border-b-4 border-black/20"
                    >
                        BẮT ĐẦU QUAY THƯỞNG
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Share Link & Config */}
                <div className="md:col-span-1 space-y-8">

                    {/* Block 1: Share Link */}
                    <div className="bg-surface border-4 border-primary rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                        <h3 className="text-lg font-bold text-primary uppercase mb-4 tracking-wider">Link Chia Sẻ Khách Mời</h3>
                        <p className="text-sm text-text-muted mb-3 italic">Copy link này gửi cho khách mời để họ lấy số may mắn tự động trúng thưởng.</p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 text-text-main text-sm select-all focus:outline-none focus:border-primary/60"
                            />
                            <button
                                onClick={copyLink}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-lg transition-all active:scale-95 shadow-md"
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>

                    {/* Block 2: White Label Config */}
                    <div className="bg-surface border-4 border-primary rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <h1 className="text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2 tracking-wider">
                            ⚙️ Cấu hình thương hiệu
                            {!config?.isVip && <span className="text-[10px] bg-background px-2 py-0.5 rounded-md text-primary border border-primary/30">Gói FREE</span>}
                        </h1>

                        <form onSubmit={handleUpdateConfig} className={`space-y-4 ${!config?.isVip ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-primary/80 text-xs font-bold mb-1 uppercase tracking-tight">Tên hiển thị</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 text-text-main focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-primary/80 text-xs font-bold mb-1 uppercase tracking-tight">Logo URL</label>
                                <input
                                    type="text"
                                    value={customLogoUrl}
                                    onChange={e => setCustomLogoUrl(e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 text-text-main focus:border-primary focus:outline-none placeholder-text-muted/30 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-primary/80 text-xs font-bold mb-1 uppercase tracking-tight">Màu Chủ Đạo (HEX)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={brandColor}
                                        onChange={e => setBrandColor(e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer bg-background border border-primary/30 p-1"
                                    />
                                    <input
                                        type="text"
                                        value={brandColor}
                                        onChange={e => setBrandColor(e.target.value)}
                                        className="flex-1 bg-background border border-primary/30 rounded-lg px-3 py-2 text-text-main focus:border-primary focus:outline-none uppercase font-mono"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!config?.isVip || isUpdating}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg border-b-2 border-black/20 disabled:opacity-50"
                            >
                                {isUpdating ? 'Đang lưu...' : 'Lưu Cấu Hình'}
                            </button>
                        </form>

                        {!config?.isVip && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[3px]">
                                <div className="text-4xl mb-4 drop-shadow-lg">⭐ Tính năng VIP</div>
                                <div className="text-primary font-bold text-center px-6 leading-relaxed max-w-xs">
                                    Liên hệ Super Admin để mở khóa tùy chỉnh thương hiệu
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Participants Table */}
                <div className="md:col-span-2">
                    {/* Block 3: Participants */}
                    <div className="bg-surface border-4 border-primary rounded-2xl p-6 shadow-xl h-full">
                        <div className="flex justify-between items-center mb-6 border-b border-primary/20 pb-4">
                            <h3 className="text-xl font-bold text-primary uppercase tracking-tight">
                                👥 Danh Sách Đã Đăng Ký ({participants.length})
                            </h3>
                        </div>

                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-background shadow-md">
                                    <tr>
                                        <th className="py-3 px-4 text-primary font-bold text-sm uppercase tracking-wider border-b-2 border-primary/30">STT</th>
                                        <th className="py-3 px-4 text-primary font-bold text-sm uppercase tracking-wider border-b-2 border-primary/30">Họ & Tên</th>
                                        <th className="py-3 px-4 text-primary font-bold text-sm uppercase tracking-wider border-b-2 border-primary/30">SĐT</th>
                                        <th className="py-3 px-4 text-primary font-bold text-sm uppercase tracking-wider border-b-2 border-primary/30 text-center">Số May Mắn</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/10">
                                    {participants.map((p, index) => (
                                        <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="py-3 px-4 text-text-main font-mono">{index + 1}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-text-main">{p.fullName}</div>
                                                <div className="text-[10px] text-text-muted uppercase font-bold">{p.org}</div>
                                            </td>
                                            <td className="py-3 px-4 text-text-main/80 font-mono">{p.phoneNumber}</td>
                                            <td className="py-1 px-4 text-center">
                                                <span className="inline-block bg-primary text-primary-foreground font-black px-4 py-1.5 rounded-lg shadow-sm font-mono text-lg tracking-widest border-b-2 border-black/10">
                                                    {p.luckyNumber.toString().padStart(5, "0")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {participants.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-text-muted italic">
                                                Chưa có người chơi nào đăng ký nhận số thử vận may.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};
