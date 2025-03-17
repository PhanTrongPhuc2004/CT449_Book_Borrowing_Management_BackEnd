const express = require('express');
const muonTraController = require('../controllers/muonTraController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Áp dụng bảo vệ cho tất cả routes
router.use(authMiddleware.protect);

// Routes cho người dùng bình thường
router.get('/dangmuon', muonTraController.danhSachDangMuon);
router.get('/lichsu/:MaDocGia', muonTraController.lichSuMuonCuaDocGia);

// Routes chỉ cho thủ thư và admin
router.use(authMiddleware.restrictTo('thủ thư', 'admin'));

router.post('/muon', muonTraController.muonSach);
router.post('/tra', muonTraController.traSach);
router.get('/quahan', muonTraController.danhSachQuaHan);

module.exports = router;