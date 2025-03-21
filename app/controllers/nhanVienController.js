// controllers/nhanVienController.js
const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lấy tất cả nhân viên
exports.getAllNhanVien = async (req, res) => {
    try {
        // Loại bỏ trường password trong kết quả trả về
        const nhanVienList = await NhanVien.find().select('-Password').sort({ HoTenNV: 1 });

        res.status(200).json({
            success: true,
            count: nhanVienList.length,
            data: nhanVienList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách nhân viên',
            error: error.message
        });
    }
};

// Lấy chi tiết một nhân viên theo ID
exports.getNhanVienById = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params.id).select('-Password');

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên với ID này'
            });
        }

        res.status(200).json({
            success: true,
            data: nhanVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin nhân viên',
            error: error.message
        });
    }
};

// Lấy nhân viên theo mã số
exports.getNhanVienByMaSo = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findOne({ MSNV: req.params.maSo }).select('-Password');

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên với mã số này'
            });
        }

        res.status(200).json({
            success: true,
            data: nhanVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin nhân viên',
            error: error.message
        });
    }
};

// Tạo nhân viên mới
exports.createNhanVien = async (req, res) => {
    try {
        // Kiểm tra xem mã số nhân viên đã tồn tại chưa
        const existingNhanVien = await NhanVien.findOne({ MSNV: req.body.MSNV });

        if (existingNhanVien) {
            return res.status(400).json({
                success: false,
                message: 'Mã số nhân viên này đã tồn tại'
            });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.Password, salt);

        const nhanVien = await NhanVien.create({
            ...req.body,
            Password: hashedPassword
        });

        // Không trả về mật khẩu trong response
        const response = {
            ...nhanVien._doc,
            Password: undefined
        };

        res.status(201).json({
            success: true,
            message: 'Tạo nhân viên mới thành công',
            data: response
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể tạo nhân viên mới',
            error: error.message
        });
    }
};

// Cập nhật thông tin nhân viên
exports.updateNhanVien = async (req, res) => {
    try {
        // Nếu cập nhật MSNV, kiểm tra xem mã mới đã tồn tại chưa
        if (req.body.MSNV) {
            const existingNhanVien = await NhanVien.findOne({
                MSNV: req.body.MSNV,
                _id: { $ne: req.params.id }
            });

            if (existingNhanVien) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã số nhân viên này đã tồn tại'
                });
            }
        }

        // Nếu cập nhật mật khẩu, mã hóa mật khẩu mới
        if (req.body.Password) {
            const salt = await bcrypt.genSalt(10);
            req.body.Password = await bcrypt.hash(req.body.Password, salt);
        }

        const nhanVien = await NhanVien.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-Password');

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: nhanVien
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật nhân viên',
            error: error.message
        });
    }
};

// Xóa nhân viên
exports.deleteNhanVien = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa nhân viên thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa nhân viên',
            error: error.message
        });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { MSNV, Password } = req.body;

        // Kiểm tra xem có nhập mã số nhân viên và mật khẩu không
        if (!MSNV || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập mã số nhân viên và mật khẩu'
            });
        }

        // Tìm nhân viên theo mã số
        const nhanVien = await NhanVien.findOne({ MSNV });

        if (!nhanVien) {
            return res.status(401).json({
                success: false,
                message: 'Mã số nhân viên hoặc mật khẩu không chính xác'
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(Password, nhanVien.Password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mã số nhân viên hoặc mật khẩu không chính xác'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: nhanVien._id, MSNV: nhanVien.MSNV, Chucvu: nhanVien.Chucvu },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            data: {
                id: nhanVien._id,
                MSNV: nhanVien.MSNV,
                HoTenNV: nhanVien.HoTenNV,
                Chucvu: nhanVien.Chucvu
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể đăng nhập',
            error: error.message
        });
    }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Kiểm tra mật khẩu cũ và mới
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới'
            });
        }

        // Tìm nhân viên theo ID từ middleware auth
        const nhanVien = await NhanVien.findById(req.user.id);

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên'
            });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(currentPassword, nhanVien.Password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới
        nhanVien.Password = hashedPassword;
        await nhanVien.save();

        res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể đổi mật khẩu',
            error: error.message
        });
    }
};

// Lấy thông tin nhân viên hiện tại (theo token)
exports.getCurrentNhanVien = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.user.id).select('-Password');

        res.status(200).json({
            success: true,
            data: nhanVien
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin nhân viên',
            error: error.message
        });
    }
};

// Tìm kiếm nhân viên
exports.searchNhanVien = async (req, res) => {
    try {
        const { keyword } = req.query;

        const nhanVienList = await NhanVien.find({
            $or: [
                { MSNV: new RegExp(keyword, 'i') },
                { HoTenNV: new RegExp(keyword, 'i') },
                { Chucvu: new RegExp(keyword, 'i') }
            ]
        }).select('-Password').sort({ HoTenNV: 1 });

        res.status(200).json({
            success: true,
            count: nhanVienList.length,
            data: nhanVienList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm nhân viên',
            error: error.message
        });
    }
};

// Đặt lại mật khẩu (dành cho Admin)
exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập mật khẩu mới'
            });
        }

        // Kiểm tra quyền admin
        if (req.user.Chucvu !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện chức năng này'
            });
        }

        const nhanVien = await NhanVien.findById(id);

        if (!nhanVien) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhân viên với ID này'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới
        nhanVien.Password = hashedPassword;
        await nhanVien.save();

        res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể đặt lại mật khẩu',
            error: error.message
        });
    }
};
