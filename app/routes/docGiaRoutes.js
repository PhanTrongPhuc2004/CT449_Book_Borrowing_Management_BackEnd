// routes/docGiaRoutes.js
const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docGiaController');
const authController = require('../controllers/xacThucController');

// Route bảo vệ - yêu cầu xác thực
// Yêu cầu quyền nhân viên hoặc admin cho các route sau
router.use(authController.protect);

// Lấy thông tin độc giả theo mã
router.get('/ma/:MaDG', docGiaController.getDocGiaByMa);

// Cập nhật thông tin độc giả
router.put('/:id', docGiaController.updateDocGia);

router.use(authController.restrictTo('nhanvien'));

// Lấy tất cả độc giả
router.get('/', docGiaController.getAllDocGia);

// Tìm kiếm độc giả
router.get('/search', docGiaController.searchDocGia);

// Lấy thông tin độc giả theo ID
router.get('/:id', docGiaController.getDocGiaById);


// Thêm độc giả mới
router.post('/', docGiaController.createDocGia);


// Xóa độc giả
router.delete('/:id', docGiaController.deleteDocGia);


module.exports = router;