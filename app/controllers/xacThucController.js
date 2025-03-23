const jwt = require('jsonwebtoken');
const config = require('../config/index');
const bcrypt = require('bcryptjs');
const NhanVien = require('../models/NhanVien');
const DocGia = require('../models/DocGia');

// Hàm tạo token
const signToken = (id, role) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
    });
};

exports.login = async (req, res, next) => {
    try {
        const { Email, Password } = req.body;

        // 1. Kiểm tra Email và Password có tồn tại
        if (!Email || !Password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp Email và mật khẩu'
            });
        }

        // 2. Kiểm tra người dùng tồn tại và mật khẩu đúng
        // Tìm kiếm trong cả hai bảng: NhanVien và DocGia
        let user = await NhanVien.findOne({ Email });
        let role = 'nhanvien';

        // Nếu không tìm thấy trong bảng NhanVien, kiểm tra bảng DocGia
        if (!user) {
            user = await DocGia.findOne({ Email });
            role = 'docgia';
        }

        // Nếu không tìm thấy user hoặc mật khẩu không đúng
        if (!user || !(await user.kiemTraMatKhau(Password, user.Password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // 3. Tạo token với ID và vai trò người dùng
        const token = signToken(role === 'nhanvien' ? user.MSNV : user.MaDG, role);

        // 4. Gửi token cho client với thông tin phù hợp theo vai trò
        const userData = {
            role: role
        };

        if (role === 'nhanvien') {
            userData.MSNV = user.MSNV;
            userData.HoTenNV = `${user.HoLot} ${user.Ten}`;
            userData.ChucVu = user.ChucVu;
        } else {
            userData.MaDG = user.MaDG;
            userData.HoTenDG = `${user.HoLot} ${user.Ten}`;
        }

        res.status(200).json({
            status: 'success',
            token,
            data: userData
        });
    } catch (err) {
        next(err);
    }
};

// Hàm đổi mật khẩu cũng cần cập nhật để hỗ trợ cả hai loại người dùng
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const role = req.user.role; // Lấy vai trò từ thông tin xác thực

        // 1. Lấy thông tin người dùng dựa trên vai trò
        let user;
        if (role === 'nhanvien') {
            user = await NhanVien.findOne({ MSNV: req.user.id });
        } else {
            user = await DocGia.findOne({ MaDG: req.user.id });
        }

        // 2. Kiểm tra mật khẩu hiện tại đúng không
        if (!(await user.kiemTraMatKhau(currentPassword, user.Password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // 3. Cập nhật mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.Password = hashedPassword;
        await user.save();

        // 4. Đăng nhập lại với token mới
        const token = signToken(role === 'nhanvien' ? user.MSNV : user.MaDG, role);

        res.status(200).json({
            status: 'success',
            token,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (err) {
        next(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1. Lấy token và kiểm tra
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.'
            });
        }

        // 2. Xác minh token
        const decoded = jwt.verify(token, config.jwtSecret);

        // 3. Kiểm tra người dùng còn tồn tại không
        const user = await findUserById(decoded.id, decoded.role);

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Người dùng thuộc token này không còn tồn tại'
            });
        }

        // 4. Lưu thông tin người dùng vào request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        // console.log(req.user);
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Token không hợp lệ! Vui lòng đăng nhập lại.'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Token đã hết hạn! Vui lòng đăng nhập lại.'
            });
        }

        next(err);
    }
};

// Kiểm tra quyền truy cập
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        next();
    };
};

const findUserById = async (id, role) => {
    try {
        let user = null;

        // Kiểm tra vai trò và tìm kiếm trong collection tương ứng
        if (role === 'nhanvien') {
            user = await NhanVien.findOne({ MSNV: id });
        } else if (role === 'docgia') {
            user = await DocGia.findOne({ MaDG: id });
        }

        return user;
    } catch (error) {
        console.error('Lỗi khi tìm người dùng:', error);
        return null;
    }
};
