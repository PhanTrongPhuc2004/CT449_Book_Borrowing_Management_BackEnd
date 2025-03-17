// routes/docGiaRoutes.js
const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docGiaController');
const authMiddleware = require('../middlewares/auth');

// Route bảo vệ - yêu cầu xác thực
router.use(authMiddleware.protect);

// Lấy tất cả độc giả
router.get('/', docGiaController.getAllDocGia);

// Tìm kiếm độc giả
router.get('/search', docGiaController.searchDocGia);

// Lấy thông tin độc giả theo ID
// router.get('/:id', docGiaController.getDocGiaById);

// Lấy thông tin độc giả theo mã
router.get('/ma/:maDocGia', docGiaController.getDocGiaByMa);

// Lấy lịch sử mượn sách của độc giả
// router.get('/:id/lichsu', docGiaController.getLichSuMuonSach);

// Lấy sách đang mượn của độc giả
// router.get('/:id/dangmuon', docGiaController.getSachDangMuon);

// Yêu cầu quyền nhân viên hoặc admin cho các route sau
router.use(authMiddleware.restrictTo('nhanvien', 'admin'));

// Thêm độc giả mới
router.post('/', docGiaController.createDocGia);

// Cập nhật thông tin độc giả
router.put('/:id', docGiaController.updateDocGia);

// Xóa độc giả
router.delete('/:id', docGiaController.deleteDocGia);

// Kiểm tra trạng thái độc giả
// router.get('/:id/status', docGiaController.checkDocGiaStatus);

// Kiểm tra mã độc giả đã tồn tại
// router.get('/check/:maDocGia', docGiaController.checkMaDocGiaExists);

module.exports = router;