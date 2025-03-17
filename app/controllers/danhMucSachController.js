// controllers/danhMucSachController.js
const DanhMucSach = require('../models/DanhMucSach');
const Sach = require('../models/Sach');

// Lấy tất cả danh mục sách
exports.getAllDanhMucSach = async (req, res) => {
    try {
        const danhMucList = await DanhMucSach.find().sort({ TenDanhMuc: 1 });

        res.status(200).json({
            success: true,
            count: danhMucList.length,
            data: danhMucList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách danh mục sách',
            error: error.message
        });
    }
};

// Lấy chi tiết một danh mục sách theo ID
exports.getDanhMucSachById = async (req, res) => {
    try {
        const danhMuc = await DanhMucSach.findById(req.params.id);

        if (!danhMuc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục sách với ID này'
            });
        }

        res.status(200).json({
            success: true,
            data: danhMuc
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin danh mục sách',
            error: error.message
        });
    }
};

// Lấy danh mục sách theo mã
exports.getDanhMucSachByMa = async (req, res) => {
    try {
        const danhMuc = await DanhMucSach.findOne({ MaDanhMuc: req.params.maDanhMuc });

        if (!danhMuc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục sách với mã này'
            });
        }

        res.status(200).json({
            success: true,
            data: danhMuc
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin danh mục sách',
            error: error.message
        });
    }
};

// Tạo danh mục sách mới
exports.createDanhMucSach = async (req, res) => {
    try {
        // Kiểm tra xem mã danh mục đã tồn tại chưa
        const existingDanhMuc = await DanhMucSach.findOne({ MaDanhMuc: req.body.MaDanhMuc });

        if (existingDanhMuc) {
            return res.status(400).json({
                success: false,
                message: 'Mã danh mục sách này đã tồn tại'
            });
        }

        const danhMuc = await DanhMucSach.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục sách mới thành công',
            data: danhMuc
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể tạo danh mục sách mới',
            error: error.message
        });
    }
};

// Cập nhật thông tin danh mục sách
exports.updateDanhMucSach = async (req, res) => {
    try {
        // Nếu cập nhật MaDanhMuc, kiểm tra xem mã mới đã tồn tại chưa
        if (req.body.MaDanhMuc) {
            const existingDanhMuc = await DanhMucSach.findOne({
                MaDanhMuc: req.body.MaDanhMuc,
                _id: { $ne: req.params.id }
            });

            if (existingDanhMuc) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã danh mục sách này đã tồn tại'
                });
            }
        }

        const danhMuc = await DanhMucSach.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!danhMuc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục sách với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục sách thành công',
            data: danhMuc
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Không thể cập nhật danh mục sách',
            error: error.message
        });
    }
};

// Xóa danh mục sách
exports.deleteDanhMucSach = async (req, res) => {
    try {
        // Kiểm tra xem có sách nào thuộc danh mục này không
        const relatedBooks = await Sach.findOne({ MaDanhMuc: req.params.maDanhMuc });

        if (relatedBooks) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa danh mục sách này vì đang có sách thuộc danh mục'
            });
        }

        const danhMuc = await DanhMucSach.findByIdAndDelete(req.params.id);

        if (!danhMuc) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục sách với ID này'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa danh mục sách thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa danh mục sách',
            error: error.message
        });
    }
};

// Lấy tất cả sách thuộc một danh mục
exports.getSachByDanhMuc = async (req, res) => {
    try {
        const sachList = await Sach.find({ MaDanhMuc: req.params.maDanhMuc })
            .sort({ TenSach: 1 });

        res.status(200).json({
            success: true,
            count: sachList.length,
            data: sachList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách sách theo danh mục',
            error: error.message
        });
    }
};

// Tìm kiếm danh mục sách theo tên
exports.searchDanhMucSach = async (req, res) => {
    try {
        const { keyword } = req.query;

        const danhMucList = await DanhMucSach.find({
            TenDanhMuc: new RegExp(keyword, 'i')
        }).sort({ TenDanhMuc: 1 });

        res.status(200).json({
            success: true,
            count: danhMucList.length,
            data: danhMucList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm danh mục sách',
            error: error.message
        });
    }
};

// Kiểm tra danh mục sách tồn tại
exports.checkDanhMucExists = async (req, res) => {
    try {
        const { maDanhMuc } = req.params;

        const danhMuc = await DanhMucSach.findOne({ MaDanhMuc: maDanhMuc });

        res.status(200).json({
            success: true,
            exists: danhMuc ? true : false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể kiểm tra danh mục sách',
            error: error.message
        });
    }
};