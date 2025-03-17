// routes/nhanVienRoutes.js
const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVienController');
const authMiddleware = require('../middlewares/auth');

// Route bảo vệ - yêu cầu xác thực
router.use(authMiddleware.protect);

// Lấy thông tin nhân viên đang đăng nhập
// router.get('/me', nhanVienController.getProfile);

// Cập nhật thông tin cá nhân của nhân viên đang đăng nhập
// router.put('/me', nhanVienController.updateProfile);

// Đổi mật khẩu nhân viên đang đăng nhập
router.put('/me/change-password', nhanVienController.changePassword);

// Yêu cầu quyền admin cho các route sau
router.use(authMiddleware.restrictTo('admin'));

// Lấy tất cả nhân viên
router.get('/', nhanVienController.getAllNhanVien);

// Lấy thông tin nhân viên theo ID
router.get('/:id', nhanVienController.getNhanVienById);

// Lấy thông tin nhân viên theo mã
// router.get('/ma/:msnv', nhanVienController.getNhanVienByMSNV);

// Tìm kiếm nhân viên
router.get('/search', nhanVienController.searchNhanVien);

// Thêm nhân viên mới
router.post('/', nhanVienController.createNhanVien);

// Cập nhật thông tin nhân viên
router.put('/:id', nhanVienController.updateNhanVien);

// Xóa nhân viên
router.delete('/:id', nhanVienController.deleteNhanVien);

// Vô hiệu hóa tài khoản nhân viên
// router.put('/:id/disable', nhanVienController.disableNhanVien);

// Kích hoạt lại tài khoản nhân viên
// router.put('/:id/enable', nhanVienController.enableNhanVien);

// Đặt lại mật khẩu nhân viên
router.put('/:id/reset-password', nhanVienController.resetPassword);

// Kiểm tra mã nhân viên đã tồn tại
// router.get('/check/:msnv', nhanVienController.checkMSNVExists);

module.exports = router;