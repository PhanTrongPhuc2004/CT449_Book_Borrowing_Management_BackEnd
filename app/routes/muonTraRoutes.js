const express = require('express');
const muonTraController = require('../controllers/muonTraController');
const authController = require('../controllers/xacThucController');

const router = express.Router();

// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);
// router.use(authController.restrictTo('nhanvien'));

// mượn sách
router.post('/muon', muonTraController.muonSach);

// trả sách
router.post('/tra', muonTraController.traSach);

// lấy danh sách đang mượn
router.get('/dangmuon', muonTraController.danhSachDangMuon);

// lấy lịch sử mượn sách của đọc giả
router.get('/lichsu/:MaDocGia', muonTraController.lichSuMuonCuaDocGia);




module.exports = router;