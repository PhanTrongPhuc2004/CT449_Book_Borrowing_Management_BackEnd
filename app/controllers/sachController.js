const sachService = require('../services/sachService');

// Lấy danh sách tất cả sách
exports.getAllSach = async (req, res, next) => {
    try {
        const sachList = await sachService.getAllSach(req.query);
        res.status(200).json({
            status: 'success',
            results: sachList.length,
            data: { sach: sachList }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy thông tin một sách theo MaSach
exports.getSachByMa = async (req, res, next) => {
    try {
        const sach = await sachService.getSachByMa(req.params.MaSach);
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { sach }
        });
    } catch (err) {
        next(err);
    }
};

// Thêm sách mới
exports.createSach = async (req, res, next) => {
    try {
        const newSach = await sachService.createSach(req.body);
        res.status(201).json({
            status: 'success',
            data: { sach: newSach }
        });
    } catch (err) {
        next(err);
    }
};

// Cập nhật thông tin sách
exports.updateSach = async (req, res, next) => {
    try {
        const sach = await sachService.updateSach(req.params.MaSach, req.body);
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { sach }
        });
    } catch (err) {
        next(err);
    }
};

// Xóa sách
exports.deleteSach = async (req, res, next) => {
    try {
        const sach = await sachService.deleteSach(req.params.MaSach);
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Tìm kiếm sách
exports.searchSach = async (req, res, next) => {
    try {
        const result = await sachService.searchSach(req.query);
        res.status(200).json({
            status: 'success',
            results: result.length,
            data: { sach: result }
        });
    } catch (err) {
        next(err);
    }
};