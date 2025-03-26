const Sach = require('../models/Sach');

// Lấy danh sách tất cả sách
exports.getAllSach = async (req, res) => {
    try {
        // Xử lý filter từ query
        const filter = {};

        if (req.query.TenSach) {
            filter.TenSach = { $regex: req.query.TenSach, $options: 'i' };
        }

        if (req.query.MaDanhMuc) {
            filter.MaDanhMuc = req.query.MaDanhMuc;
        }

        if (req.query.MaNXB) {
            filter.MaNXB = req.query.MaNXB;
        }

        if (req.query.NamXuatBan) {
            filter.NamXuatBan = req.query.NamXuatBan;
        }

        // Thực hiện truy vấn với populate
        const sachList = await Sach.find(filter)
            .populate('MaNXB', 'TenNXB')
            .populate('MaDanhMuc', 'TenDanhMuc')
            .sort({ TenSach: 1 });

        res.status(200).json({
            success: true,
            count: sachList.length,
            data: sachList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách sách',
            error: error.message
        });
    }
};

// Lấy thông tin một sách theo MaSach
exports.getSachByMa = async (req, res) => {
    try {
        const sach = await Sach.findOne({ MaSach: req.params.MaSach })
            .populate('MaNXB', 'TenNXB')
            .populate('MaDanhMuc', 'TenDanhMuc');

        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với mã này'
            });
        }

        res.status(200).json({
            success: true,
            data: sach
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin sách',
            error: error.message
        });
    }
};

// Lấy thông tin một sách theo ID
exports.getSachById = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params.id);
        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với ID này'
            });
        }
        res.status(200).json({
            success: true,
            data: sach
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin sách',
            error: error.message
        });
    }
};

// Hàm tạo MaSach không trùng lặp
const taoMaSach = async () => {
    let count = await Sach.countDocuments();
    let maSach;
    let isUnique = false;

    while (!isUnique) {
        count++;
        maSach = `S${String(count).padStart(3, '0')}`;
        const existingSach = await Sach.findOne({ MaSach: maSach });
        if (!existingSach) {
            isUnique = true; // Thoát vòng lặp khi tìm được mã không trùng
        }
    }

    return maSach;
};
// Thêm sách mới
exports.createSach = async (req, res) => {
    try {
        // Kiểm tra ten sách đã tồn tại chưa
        const existingSach = await Sach.findOne({TenSach: req.body.TenSach });

        if (existingSach) {
            return res.status(400).json({
                success: false,
                message: 'Mã sách này đã tồn tại'
            });
        }
        const maSach = await taoMaSach();

        const newSach = await Sach.create({MaSach: maSach, ...req.body});

        res.status(201).json({
            success: true,
            message: 'Thêm sách mới thành công',
            data: newSach
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Không thể thêm sách mới',
            error: error.message
        });
    }
};

// Cập nhật thông tin sách
exports.updateSach = async (req, res) => {
    try {
        // Nếu cập nhật MaSach, kiểm tra mã mới đã tồn tại chưa
        if (req.body.MaSach) {
            const existingSach = await Sach.findOne({
                MaSach: req.body.MaSach,
                _id: { $ne: req.params.id }
            });

            if (existingSach) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã sách này đã tồn tại'
                });
            }
        }

        const sach = await Sach.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('MaNXB', 'TenNXB')
            .populate('MaDanhMuc', 'TenDanhMuc');

        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật sách thành công',
            data: sach
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật sách',
            error: error.message
        });
    }
};

// Cập nhật thông tin sách theo MaSach
exports.updateSachByMa = async (req, res) => {
    try {
        // Nếu cập nhật MaSach, kiểm tra mã mới đã tồn tại chưa
        if (req.body.MaSach && req.body.MaSach !== req.params.MaSach) {
            const existingSach = await Sach.findOne({
                MaSach: req.body.MaSach
            });

            if (existingSach) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã sách này đã tồn tại'
                });
            }
        }

        const sach = await Sach.findOneAndUpdate(
            { MaSach: req.params.MaSach },
            req.body,
            { new: true, runValidators: true }
        ).populate('MaNXB', 'TenNXB')
            .populate('MaDanhMuc', 'TenDanhMuc');

        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với mã này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật sách thành công',
            data: sach
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật sách',
            error: error.message
        });
    }
};

// Xóa sách
exports.deleteSach = async (req, res) => {
    try {
        const sach = await Sach.findByIdAndDelete(req.params.id);

        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa sách thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa sách',
            error: error.message
        });
    }
};

// Xóa sách theo MaSach
exports.deleteSachByMa = async (req, res) => {
    try {
        const sach = await Sach.findOneAndDelete({ MaSach: req.params.MaSach });

        if (!sach) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách với mã này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa sách thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa sách',
            error: error.message
        });
    }
};

// Tìm kiếm sách
exports.searchSach = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp từ khóa tìm kiếm'
            });
        }

        const sachList = await Sach.find({
            $or: [
                { TenSach: { $regex: keyword, $options: 'i' } },
                { NguonGoc: { $regex: keyword, $options: 'i' } },
                { MoTa: { $regex: keyword, $options: 'i' } }
            ]
        })
            .populate('MaNXB', 'TenNXB')
            .populate('MaDanhMuc', 'TenDanhMuc');

        res.status(200).json({
            success: true,
            count: sachList.length,
            data: sachList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể thực hiện tìm kiếm sách',
            error: error.message
        });
    }
};