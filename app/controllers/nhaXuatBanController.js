// controllers/nhaXuatBanController.js
const NhaXuatBan = require('../models/NhaXuatBan');
const Sach = require('../models/Sach');

// Lấy tất cả nhà xuất bản
exports.getAllNhaXuatBan = async (req, res) => {
    try {
        const nxbList = await NhaXuatBan.find().sort({ TenNXB: 1 });

        res.status(200).json({
            success: true,
            count: nxbList.length,
            data: nxbList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách nhà xuất bản',
            error: error.message
        });
    }
};

// Lấy chi tiết một nhà xuất bản theo ID
exports.getNhaXuatBanById = async (req, res) => {
    try {
        const nxb = await NhaXuatBan.findById(req.params.id);

        if (!nxb) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà xuất bản với ID này'
            });
        }

        res.status(200).json({
            success: true,
            data: nxb
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin nhà xuất bản',
            error: error.message
        });
    }
};

// Lấy nhà xuất bản theo mã
exports.getNhaXuatBanByMa = async (req, res) => {
    try {
        const nxb = await NhaXuatBan.findOne({ MaNXB: req.params.maNXB });

        if (!nxb) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà xuất bản với mã này'
            });
        }

        res.status(200).json({
            success: true,
            data: nxb
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin nhà xuất bản',
            error: error.message
        });
    }
};

// Tạo nhà xuất bản mới
exports.createNhaXuatBan = async (req, res) => {
    try {
        // Kiểm tra xem mã nhà xuất bản đã tồn tại chưa
        const existingNXB = await NhaXuatBan.findOne({ MaNXB: req.body.MaNXB });

        if (existingNXB) {
            return res.status(400).json({
                success: false,
                message: 'Mã nhà xuất bản này đã tồn tại'
            });
        }

        const nxb = await NhaXuatBan.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Tạo nhà xuất bản mới thành công',
            data: nxb
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể tạo nhà xuất bản mới',
            error: error.message
        });
    }
};

// Cập nhật thông tin nhà xuất bản
exports.updateNhaXuatBan = async (req, res) => {
    try {
        // Nếu cập nhật MaNXB, kiểm tra xem mã mới đã tồn tại chưa
        if (req.body.MaNXB) {
            const existingNXB = await NhaXuatBan.findOne({
                MaNXB: req.body.MaNXB,
                _id: { $ne: req.params.id }
            });

            if (existingNXB) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã nhà xuất bản này đã tồn tại'
                });
            }
        }

        const nxb = await NhaXuatBan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!nxb) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà xuất bản với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật nhà xuất bản thành công',
            data: nxb
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật nhà xuất bản',
            error: error.message
        });
    }
};

// Xóa nhà xuất bản
exports.deleteNhaXuatBan = async (req, res) => {
    try {
        // Kiểm tra xem có sách nào thuộc nhà xuất bản này không
        const relatedBooks = await Sach.findOne({ MaNXB: req.params.maNXB });

        if (relatedBooks) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa nhà xuất bản này vì đang có sách thuộc nhà xuất bản'
            });
        }

        const nxb = await NhaXuatBan.findByIdAndDelete(req.params.id);

        if (!nxb) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nhà xuất bản với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa nhà xuất bản thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa nhà xuất bản',
            error: error.message
        });
    }
};

// Lấy tất cả sách thuộc một nhà xuất bản
exports.getSachByNhaXuatBan = async (req, res) => {
    try {
        const sachList = await Sach.find({ MaNXB: req.params.id })
            .sort({ TenSach: 1 });

        res.status(200).json({
            success: true,
            count: sachList.length,
            data: sachList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách sách theo nhà xuất bản',
            error: error.message
        });
    }
};

// Tìm kiếm nhà xuất bản theo tên
exports.searchNhaXuatBan = async (req, res) => {
    try {
        const { keyword } = req.query;

        const nxbList = await NhaXuatBan.find({
            $or: [
                { TenNXB: new RegExp(keyword, 'i') },
                { DiaChi: new RegExp(keyword, 'i') }
            ]
        }).sort({ TenNXB: 1 });

        res.status(200).json({
            success: true,
            count: nxbList.length,
            data: nxbList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm nhà xuất bản',
            error: error.message
        });
    }
};

// Kiểm tra nhà xuất bản tồn tại
exports.checkNhaXuatBanExists = async (req, res) => {
    try {
        const { maNXB } = req.params;

        const nxb = await NhaXuatBan.findOne({ MaNXB: maNXB });

        res.status(200).json({
            success: true,
            exists: nxb ? true : false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể kiểm tra nhà xuất bản',
            error: error.message
        });
    }
};