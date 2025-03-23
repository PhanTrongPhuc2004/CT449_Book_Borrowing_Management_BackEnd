// controllers/docGiaController.js
const DocGia = require('../models/DocGia');
const bcrypt = require('bcryptjs');

// Lấy tất cả độc giả
exports.getAllDocGia = async (req, res) => {
    try {
        // Loại bỏ trường password trong kết quả trả về
        const docGiaList = await DocGia.find().select('-Password').sort({ Ten: 1 });

        res.status(200).json({
            count: docGiaList.length,
            data: docGiaList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách độc giả',
            error: error.message
        });
    }
};

// Lấy chi tiết một độc giả theo ID
exports.getDocGiaById = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params.id).select('-Password');

        if (!docGia) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy độc giả với ID này'
            });
        }

        res.status(200).json({
            success: true,
            data: docGia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin độc giả',
            error: error.message
        });
    }
};

// Lấy độc giả theo mã
exports.getDocGiaByMa = async (req, res) => {
    try {
        const docGia = await DocGia.findOne({ MaDG: req.params.MaDG }).select('-Password');

        if (!docGia) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy độc giả với mã này'
            });
        }

        res.status(200).json({
            success: true,
            data: docGia
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin độc giả',
            error: error.message
        });
    }
};

// Tạo độc giả mới
exports.createDocGia = async (req, res) => {
    try {
        // Kiểm tra xem mã độc giả đã tồn tại chưa
        const existingDocGia = await DocGia.findOne({ MaDG: req.body.MaDG });

        if (existingDocGia) {
            return res.status(400).json({
                success: false,
                message: 'Mã độc giả này đã tồn tại'
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await DocGia.findOne({ Email: req.body.Email });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được sử dụng'
            });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.Password, salt);

        const docGia = await DocGia.create({
            ...req.body,
            Password: hashedPassword
        });

        // Không trả về mật khẩu trong response
        const response = {
            ...docGia._doc,
            Password: undefined
        };

        res.status(201).json({
            success: true,
            message: 'Tạo độc giả mới thành công',
            data: response
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể tạo độc giả mới',
            error: error.message
        });
    }
};

// Cập nhật thông tin độc giả
exports.updateDocGia = async (req, res) => {
    try {
        // Nếu cập nhật MaDG, kiểm tra xem mã mới đã tồn tại chưa
        if (req.body.MaDG) {
            const existingDocGia = await DocGia.findOne({
                MaDG: req.body.MaDG,
                _id: { $ne: req.params.id }
            });

            if (existingDocGia) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã độc giả này đã tồn tại'
                });
            }
        }

        // Nếu cập nhật Email, kiểm tra xem email mới đã tồn tại chưa
        if (req.body.Email) {
            const existingEmail = await DocGia.findOne({
                Email: req.body.Email,
                _id: { $ne: req.params.id }
            });

            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email này đã được sử dụng'
                });
            }
        }

        // Nếu cập nhật mật khẩu, mã hóa mật khẩu mới
        if (req.body.Password) {
            const salt = await bcrypt.genSalt(10);
            req.body.Password = await bcrypt.hash(req.body.Password, salt);
        }

        const docGia = await DocGia.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-Password');

        if (!docGia) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy độc giả với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật độc giả thành công',
            data: docGia
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật độc giả',
            error: error.message
        });
    }
};

// Xóa độc giả
exports.deleteDocGia = async (req, res) => {
    try {
        const docGia = await DocGia.findByIdAndDelete(req.params.id);

        if (!docGia) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy độc giả với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa độc giả thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa độc giả',
            error: error.message
        });
    }
};

// Tìm kiếm độc giả
exports.searchDocGia = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp từ khóa tìm kiếm'
            });
        }

        const docGiaList = await DocGia.find({
            $or: [
                { MaDG: { $regex: keyword, $options: 'i' } },
                { HoLot: { $regex: keyword, $options: 'i' } },
                { Ten: { $regex: keyword, $options: 'i' } },
                { Email: { $regex: keyword, $options: 'i' } },
                { DienThoai: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-Password');

        res.status(200).json({
            success: true,
            count: docGiaList.length,
            data: docGiaList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể thực hiện tìm kiếm độc giả',
            error: error.message
        });
    }
};