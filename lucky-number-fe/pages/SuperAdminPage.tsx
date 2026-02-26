import React, { useState, useEffect, useCallback } from "react";
import { getSuperAdminTenants, updateSuperAdminTenant, SuperAdminTenant, getUserIdFromToken, isAuthenticated, logout } from "../services/api";
import { useNavigate } from "react-router-dom";

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
            <div className="bg-red-800 border bg-gradient-to-b from-red-800 to-red-900 border-yellow-600/50 rounded-2xl p-8 shadow-2xl w-full flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">
                        Super Admin Dashboard
                    </h1>
                    <p className="text-yellow-200/70 text-sm mt-2 font-medium">
                        Quản lý tập trung toàn bộ Khách hàng & Công ty
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Tổng Hệ Thống</div>
                        <div className="text-3xl font-black text-yellow-300">{tenants.length} Tenants</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-950/50 hover:bg-red-900 text-red-300 border border-red-500/30 px-5 py-3 rounded-xl font-bold uppercase transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-red-950/50 border border-yellow-600/30 rounded-2xl p-6 shadow-inner overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-yellow-600/30 text-yellow-500 uppercase tracking-widest text-xs font-bold">
                                <th className="p-4 whitespace-nowrap">Khách hàng</th>
                                <th className="p-4 whitespace-nowrap">Email</th>
                                <th className="p-4 whitespace-nowrap">Trạng thái</th>
                                <th className="p-4 whitespace-nowrap">Hạn mức (Người)</th>
                                <th className="p-4 whitespace-nowrap">Ngày hết hạn</th>
                                <th className="p-4 whitespace-nowrap text-right">Quản lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((t) => (
                                <tr key={t._id || t.id || Math.random().toString()} className="border-b border-yellow-600/10 hover:bg-red-900/30 transition-colors">
                                    <td className="p-4 font-bold text-yellow-100">
                                        {t.name}
                                        {t.isVip && <span className="ml-2 text-xs bg-yellow-500 text-red-900 px-2 py-0.5 rounded-full uppercase tracking-tighter">👑 VIP</span>}
                                    </td>
                                    <td className="p-4 text-sm text-yellow-200/70">{t.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${t.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {t.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-mono font-bold text-yellow-300">
                                        {t.maxParticipants}
                                    </td>
                                    <td className="p-4 text-sm text-yellow-200/70">
                                        {t.validUntil ? new Date(t.validUntil).toLocaleDateString("vi-VN") : "Vĩnh viễn"}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleOpenEditModal(t)}
                                            className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-bold uppercase tracking-tighter transition-colors border border-yellow-500/30"
                                        >
                                            Cấp Hạn Mức
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-yellow-200/50 font-medium">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-red-900 border-2 border-yellow-500 rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-yellow-500/50 hover:text-yellow-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-tighter mb-6">
                            Sửa hạn mức: {selectedTenant.name}
                        </h3>

                        <form onSubmit={handleSaveTenant} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-yellow-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                        Giới hạn người chơi
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editMaxParticipants}
                                        onChange={(e) => setEditMaxParticipants(parseInt(e.target.value) || 1)}
                                        className="w-full bg-red-950/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-yellow-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full bg-red-950/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <option value="Active">Hoạt động (Active)</option>
                                        <option value="Inactive">Khóa (Inactive)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-yellow-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                    Ngày hết hạn Dịch vụ
                                </label>
                                <input
                                    type="date"
                                    value={editValidUntil}
                                    onChange={(e) => setEditValidUntil(e.target.value)}
                                    className="w-full bg-red-950/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
                                />
                                <p className="text-red-300 text-xs mt-1">Bỏ trống nếu cấp quyền vĩnh viễn.</p>
                            </div>

                            <div>
                                <label className="block text-yellow-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                    Tài Khoản VIP
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editIsVip}
                                        onChange={(e) => setEditIsVip(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-yellow-500 bg-red-950 border-yellow-600 rounded focus:ring-yellow-400 focus:ring-offset-red-900"
                                    />
                                    <span className="text-yellow-100 font-bold text-sm">Kích hoạt đặc quyền VIP (Tuỳ chỉnh thương hiệu riêng)</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-yellow-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                    Ghi chú nội bộ
                                </label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className="w-full bg-red-950/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[100px]"
                                    placeholder="Lưu ý về khách hàng này..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 bg-red-900/50 rounded-xl font-bold text-yellow-500 hover:bg-red-800 transition-colors uppercase tracking-tighter"
                                >
                                    Hủy Bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 bg-yellow-500 rounded-xl font-black text-red-900 shadow-[0_4px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-tighter disabled:opacity-50 flex justify-center items-center"
                                >
                                    {isSaving ? (
                                        <svg className="animate-spin h-5 w-5 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
