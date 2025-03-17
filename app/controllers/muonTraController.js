const muonTraService = require('../services/muonTraService');

// Mượn sách
exports.muonSach = async (req, res, next) => {
    try {
        const { MaDocGia, MaSach } = req.body;

        const ketQua = await muonTraService.muonSach(MaDocGia, MaSach);

        res.status(201).json({
            status: 'success',
            data: { muonSach: ketQua }
        });
    } catch (err) {
        next(err);
    }
};

// Trả sách
exports.traSach = async (req, res, next) => {
    try {
        const { MaDocGia, MaSach } = req.body;

        const ketQua = await muonTraService.traSach(MaDocGia, MaSach);

        res.status(200).json({
            status: 'success',
            data: { traSach: ketQua }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy danh sách sách đang mượn
exports.danhSachDangMuon = async (req, res, next) => {
    try {
        const danhSach = await muonTraService.danhSachDangMuon(req.query);

        res.status(200).json({
            status: 'success',
            results: danhSach.length,
            data: { danhSachMuon: danhSach }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy danh sách sách quá hạn
exports.danhSachQuaHan = async (req, res, next) => {
    try {
        const danhSach = await muonTraService.danhSachQuaHan();

        res.status(200).json({
            status: 'success',
            results: danhSach.length,
            data: { danhSachQuaHan: danhSach }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy lịch sử mượn sách của một độc giả
exports.lichSuMuonCuaDocGia = async (req, res, next) => {
    try {
        const lichSu = await muonTraService.lichSuMuonCuaDocGia(req.params.MaDocGia);

        res.status(200).json({
            status: 'success',
            results: lichSu.length,
            data: { lichSuMuon: lichSu }
        });
    } catch (err) {
        next(err);
    }
};