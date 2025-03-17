const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien');
const config = require('../config/index');

// Hàm tạo token
const signToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
    });
};

exports.login = async (req, res, next) => {
    try {
        const { MSNV, Password } = req.body;

        // 1. Kiểm tra MSNV và Password có tồn tại
        if (!MSNV || !Password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp MSNV và mật khẩu'
            });
        }

        // 2. Kiểm tra nhân viên tồn tại & mật khẩu đúng
        const nhanVien = await NhanVien.findOne({ MSNV });

        if (!nhanVien || !(await nhanVien.kiemTraMatKhau(Password, nhanVien.Password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'MSNV hoặc mật khẩu không chính xác'
            });
        }

        // 3. Tạo token
        const token = signToken(nhanVien.MSNV);

        // 4. Gửi token cho client
        res.status(200).json({
            status: 'success',
            token,
            data: {
                MSNV: nhanVien.MSNV,
                HoTenNV: nhanVien.HoTenNV,
                ChucVu: nhanVien.ChucVu
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // 1. Lấy thông tin nhân viên
        const nhanVien = await NhanVien.findOne({ MSNV: req.nhanVien.MSNV });

        // 2. Kiểm tra mật khẩu hiện tại đúng không
        if (!(await nhanVien.kiemTraMatKhau(currentPassword, nhanVien.Password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // 3. Cập nhật mật khẩu
        nhanVien.Password = newPassword;
        await nhanVien.save();

        // 4. Đăng nhập lại với token mới
        const token = signToken(nhanVien.MSNV);

        res.status(200).json({
            status: 'success',
            token,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (err) {
        next(err);
    }
};