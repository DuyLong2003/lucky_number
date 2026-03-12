import React, { useState, useEffect, useCallback } from "react";
import { getSuperAdminTenants, updateSuperAdminTenant, SuperAdminTenant, getUserIdFromToken, isAuthenticated, logout } from "../services/api";
import { useNavigate } from "react-router-dom";
import { generateThemeStyleTag } from '../src/utils/themeGen';

export const SuperAdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState<SuperAdminTenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTenant, setSelectedTenant] = useState<SuperAdminTenant | null>(null);

    // Modal states
    const [editMaxParticipants, setEditMaxParticipants] = useState<number>(0);
    const [editValidUntil, setEditValidUntil] = useState<string>("");
    const [editStatus, setEditStatus] = useState<string>("Active");
    const [editNotes, setEditNotes] = useState<string>("");
    const [editIsVip, setEditIsVip] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchTenants = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await getSuperAdminTenants({ limit: 100, sortBy: "createdAt:desc" });
            setTenants(response.results);
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError("Bạn không có quyền truy cập trang này (Yêu cầu Super Admin).");
            } else {
                setError("Không thể tải danh sách Tenants.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchTenants();
    }, [fetchTenants, navigate]);

    const handleOpenEditModal = (tenant: SuperAdminTenant) => {
        setSelectedTenant(tenant);
        setEditMaxParticipants(tenant.maxParticipants);
        setEditValidUntil(tenant.validUntil ? tenant.validUntil.split("T")[0] : "");
        setEditStatus(tenant.status || "Active");
        setEditNotes(tenant.notes || "");
        setEditIsVip(tenant.isVip || false);
    };

    const handleCloseModal = () => {
        setSelectedTenant(null);
    };

    const handleSaveTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTenant) return;

        try {
            setIsSaving(true);
            await updateSuperAdminTenant(selectedTenant._id || selectedTenant.id, {
                maxParticipants: editMaxParticipants,
                validUntil: editValidUntil ? new Date(editValidUntil).toISOString() : null,
                status: editStatus,
                notes: editNotes,
                isVip: editIsVip
            });
            handleCloseModal();
            await fetchTenants(); // Reload list
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Cập nhật thất bại. Vui lòng thử lại.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi Super Admin?")) {
            await logout();
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-20">
                <svg className="animate-spin h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 text-center">
                <div className="bg-red-950/80 border border-red-500/50 rounded-2xl p-8 mb-4">
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-2">Truy cập bị từ chối</h2>
                    <p className="text-red-200">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Header Info */}
            <div className="bg-surface border-4 border-primary rounded-2xl p-8 shadow-2xl w-full flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">
                        Super Admin Dashboard
                    </h1>
                    <p className="text-text-main text-sm mt-2 font-medium">
                        Quản lý tập trung toàn bộ Khách hàng & Công ty
                    </p>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right">
                        <div className="text-xs font-bold text-primary uppercase tracking-widest opacity-70">Tổng Hệ Thống</div>
                        <div className="text-3xl font-black text-primary">{tenants.length} Tenants</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-background hover:bg-red-500/10 text-red-500 border border-red-500/30 px-5 py-3 rounded-xl font-bold uppercase transition-all active:scale-95"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-surface border-4 border-primary rounded-2xl p-6 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-primary/30 text-primary uppercase tracking-widest text-xs font-black">
                                <th className="p-4 whitespace-nowrap">Khách hàng</th>
                                <th className="p-4 whitespace-nowrap">Email</th>
                                <th className="p-4 whitespace-nowrap text-center">Trạng thái</th>
                                <th className="p-4 whitespace-nowrap text-center">Hạn mức (Người)</th>
                                <th className="p-4 whitespace-nowrap text-center">Ngày hết hạn</th>
                                <th className="p-4 whitespace-nowrap text-right">Quản lý</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {tenants.map((t) => (
                                <tr key={t._id || t.id || Math.random().toString()} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-text-main text-lg">{t.name}</div>
                                        {t.isVip && (
                                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                                                <span>👑</span> VIP
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-text-muted font-medium">{t.email}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'Active' || t.status === 'active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                                            {t.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-mono font-bold text-primary text-xl">
                                        {t.maxParticipants}
                                    </td>
                                    <td className="p-4 text-center text-sm text-text-muted">
                                        {t.validUntil ? (
                                            <div className="font-mono bg-background px-2 py-1 rounded-md inline-block border border-primary/10">
                                                {new Date(t.validUntil).toLocaleDateString("vi-VN")}
                                            </div>
                                        ) : (
                                            <span className="opacity-40 italic">Vĩnh viễn</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleOpenEditModal(t)}
                                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 border-b-2 border-black/10"
                                        >
                                            Cấp Hạn Mức
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-text-muted italic text-lg">
                                        Chưa có khách hàng nào trong hệ thống.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {selectedTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
                    <div className="bg-surface border-4 border-primary rounded-3xl p-8 shadow-2xl w-full max-w-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />

                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 border-b border-primary/10 pb-4">
                            Sửa hạn mức: <span className="text-text-main">{selectedTenant.name}</span>
                        </h3>

                        <form onSubmit={handleSaveTenant} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-primary font-bold text-[10px] mb-2 uppercase tracking-[0.2em] opacity-80">
                                        Giới hạn người chơi
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editMaxParticipants}
                                        onChange={(e) => setEditMaxParticipants(parseInt(e.target.value) || 1)}
                                        className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary font-mono font-bold text-lg shadow-inner"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-primary font-bold text-[10px] mb-2 uppercase tracking-[0.2em] opacity-80">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary font-bold shadow-inner"
                                    >
                                        <option value="active">Hoạt động (Active)</option>
                                        <option value="lock">Khóa (Lock)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-primary font-bold text-[10px] mb-2 uppercase tracking-[0.2em] opacity-80">
                                    Ngày hết hạn Dịch vụ
                                </label>
                                <input
                                    type="date"
                                    value={editValidUntil}
                                    onChange={(e) => setEditValidUntil(e.target.value)}
                                    className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary font-mono shadow-inner"
                                />
                                <p className="text-text-muted text-[10px] mt-2 italic font-medium">Bỏ trống nếu cấp quyền vĩnh viễn.</p>
                            </div>

                            <div className="bg-background/50 border border-primary/10 rounded-2xl p-4">
                                <label className="flex items-center space-x-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={editIsVip}
                                            onChange={(e) => setEditIsVip(e.target.checked)}
                                            className="form-checkbox h-6 w-6 text-primary bg-background border-2 border-primary/30 rounded focus:ring-primary focus:ring-offset-surface transition-all"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-primary font-black text-sm uppercase tracking-wide">Tài Khoản VIP ✨</span>
                                        <p className="text-text-muted text-[10px] font-medium leading-tight mt-0.5">Kích hoạt đặc quyền tùy chỉnh thương hiệu riêng biệt (Logo & Màu sắc).</p>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-primary font-bold text-[10px] mb-2 uppercase tracking-[0.2em] opacity-80">
                                    Ghi chú nội bộ
                                </label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary min-h-[100px] text-sm shadow-inner"
                                    placeholder="Lưu ý về khách hàng này..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-4 bg-background border-2 border-primary/20 rounded-2xl font-black text-primary hover:bg-primary/5 transition-all uppercase tracking-widest text-xs active:scale-95"
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl hover:bg-primary/90 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 border-b-4 border-black/20 flex justify-center items-center h-[56px]"
                                >
                                    {isSaving ? (
                                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : "Lưu Cập Nhật"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};
