// routes/nhaXuatBanRoutes.js
const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controllers/nhaXuatBanController');
const authController = require('../controllers/xacThucController');


// Lấy tất cả nhà xuất bản
router.get('/', nhaXuatBanController.getAllNhaXuatBan);

// Lấy thông tin nhà xuất bản theo ID
router.get('/:id', nhaXuatBanController.getNhaXuatBanById);

// Lấy thông tin nhà xuất bản theo mã
router.get('/ma/:maNXB', nhaXuatBanController.getNhaXuatBanByMa);

// Lấy danh sách sách theo nhà xuất bản
router.get('/sach/:id', nhaXuatBanController.getSachByNhaXuatBan);

// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);
router.use(authController.restrictTo('nhanvien'));

// Thêm nhà xuất bản mới
router.post('/', nhaXuatBanController.createNhaXuatBan);

// Cập nhật thông tin nhà xuất bản
router.put('/:id', nhaXuatBanController.updateNhaXuatBan);

// Xóa nhà xuất bản
router.delete('/:id', nhaXuatBanController.deleteNhaXuatBan);


module.exports = router;