// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/xacThucController');
const authMiddleware = require('../middlewares/auth');

// Đăng nhập
router.post('/login', authController.login);

// Đăng xuất
// router.get('/logout', authController.logout);

// Các route bảo vệ - yêu cầu xác thực
router.use(authMiddleware.protect);

// Lấy thông tin người dùng đang đăng nhập
// router.get('/me', authController.getMe);

// Đổi mật khẩu
router.put('/change-password', authController.changePassword);

// Quên mật khẩu - Gửi email đặt lại mật khẩu
// router.post('/forgot-password', authController.forgotPassword);

// Đặt lại mật khẩu
// router.put('/reset-password', authController.resetPassword);

// Kiểm tra token hợp lệ
// router.get('/verify-token', authController.verifyToken);

// Yêu cầu quyền admin cho các route sau
router.use(authMiddleware.restrictTo('admin'));

// Đăng ký tài khoản nhân viên mới
// router.post('/register', authController.register);

module.exports = router;