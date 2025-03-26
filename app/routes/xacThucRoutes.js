// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/xacThucController');


// Đăng nhập
router.post('/dangnhap', authController.login);

// Đăng ký
 router.post('/dangky', authController.register);
 
// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);

// Đổi mật khẩu
router.put('/doimatkhau', authController.changePassword);


module.exports = router;