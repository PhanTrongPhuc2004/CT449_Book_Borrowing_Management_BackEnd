const docGiaService = require('../services/docGiaService');

// Lấy danh sách tất cả độc giả
exports.getAllDocGia = async (req, res, next) => {
    try {
        const docGiaList = await docGiaService.getAllDocGia(req.query);
        res.status(200).json({
            status: 'success',
            results: docGiaList.length,
            data: { docGia: docGiaList }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy thông tin một độc giả theo mã
exports.getDocGiaByMa = async (req, res, next) => {
    try {
        const docGia = await docGiaService.getDocGiaByMa(req.params.MaDocGia);
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { docGia }
        });
    } catch (err) {
        next(err);
    }
};

// Thêm độc giả mới
exports.createDocGia = async (req, res, next) => {
    try {
        const newDocGia = await docGiaService.createDocGia(req.body);
        res.status(201).json({
            status: 'success',
            data: { docGia: newDocGia }
        });
    } catch (err) {
        next(err);
    }
};

// Cập nhật thông tin độc giả
exports.updateDocGia = async (req, res, next) => {
    try {
        const docGia = await docGiaService.updateDocGia(req.params.MaDocGia, req.body);
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { docGia }
        });
    } catch (err) {
        next(err);
    }
};

// Xóa độc giả
exports.deleteDocGia = async (req, res, next) => {
    try {
        const docGia = await docGiaService.deleteDocGia(req.params.MaDocGia);
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
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

// Tìm kiếm độc giả
exports.searchDocGia = async (req, res, next) => {
    try {
        const result = await docGiaService.searchDocGia(req.query.keyword);
        res.status(200).json({
            status: 'success',
            results: result.length,
            data: { docGia: result }
        });
    } catch (err) {
        next(err);
    }
};