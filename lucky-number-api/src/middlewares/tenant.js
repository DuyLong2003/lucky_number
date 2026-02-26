const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User, Participant } = require('../models');

const checkTenantQuota = async (req, res, next) => {
    try {
        // 1. Nhận diện Tenant
        // - admin: lấy từ req.user._id 
        // - Khách : lấy từ req.body.userId
        const tenantId = req.user ? req.user._id : req.body.userId;

        if (!tenantId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Thiếu thông tin Tenant ID (userId).');
        }

        // 2. Lấy thông tin Tenant
        const tenant = await User.findById(tenantId);
        if (!tenant || tenant.status !== 'active') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Tài khoản công ty không hợp lệ hoặc đã bị khóa.');
        }

        // 3. Kiểm tra thời hạn (Hết hạn)
        if (tenant.validUntil && new Date() > new Date(tenant.validUntil)) {
            throw new ApiError(httpStatus.FORBIDDEN, `Dịch vụ đã hết hạn. Vui lòng liên hệ Admin để gia hạn.`);
        }

        // 4. Kiểm tra Quota (Chỉ lúc đăng ký người mới tham gia thì mới check số lượng)
        if (req.path.includes('/register') || req.path === '/') {
            if (req.method === 'POST') {
                const currentCount = await Participant.countDocuments({ userId: tenantId });
                const maxParticipants = tenant.maxParticipants || 10;

                if (currentCount >= maxParticipants) {
                    throw new ApiError(httpStatus.FORBIDDEN, `Sự kiện đã đạt giới hạn người tham gia (${maxParticipants}). Vui lòng nâng cấp gói dịch vụ.`);
                }
            }
        }

        // Pass quota check, gán lại tenant vào custom req.tenant để controller dùng
        req.tenant = tenant;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkTenantQuota,
};
