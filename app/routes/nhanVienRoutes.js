// routes/nhanVienRoutes.js
const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVienController');
const authController = require('../controllers/xacThucController');


// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);
router.use(authController.restrictTo('nhanvien'));

// Lấy tất cả nhân viên
router.get('/', nhanVienController.getAllNhanVien);

// Lấy thông tin nhân viên theo ID
router.get('/:id', nhanVienController.getNhanVienById);

// Lấy thông tin nhân viên theo mã
router.get('/ma/:MSNV', nhanVienController.getNhanVienByMa);

// Thêm nhân viên mới
router.post('/', nhanVienController.createNhanVien);

// Cập nhật thông tin nhân viên
router.put('/:id', nhanVienController.updateNhanVien);

// Xóa nhân viên
router.delete('/:id', nhanVienController.deleteNhanVien);


module.exports = router;