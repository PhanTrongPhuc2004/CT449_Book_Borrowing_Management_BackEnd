const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien');
const config = require('../config/index');

exports.protect = async (req, res, next) => {
    try {
        // 1. Kiểm tra token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
            });
        }

        // 2. Xác thực token
        const decoded = jwt.verify(token, config.jwtSecret);

        // 3. Kiểm tra nhân viên còn tồn tại
        const nhanVien = await NhanVien.findOne({ MSNV: decoded.id });
        if (!nhanVien) {
            return res.status(401).json({
                status: 'fail',
                message: 'Nhân viên không còn tồn tại trong hệ thống.'
            });
        }

        // Đặt thông tin nhân viên vào req
        req.nhanVien = nhanVien;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

exports.restrictTo = (...chucVu) => {
    return (req, res, next) => {
        if (!chucVu.includes(req.nhanVien.ChucVu)) {
            return res.status(403).json({
                status: 'fail',
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        next();
    };
};