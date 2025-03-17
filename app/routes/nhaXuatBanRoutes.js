// routes/nhaXuatBanRoutes.js
const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controllers/nhaXuatBanController');
const authMiddleware = require('../middlewares/auth');

// Route bảo vệ - yêu cầu xác thực
router.use(authMiddleware.protect);

// Lấy tất cả nhà xuất bản
router.get('/', nhaXuatBanController.getAllNhaXuatBan);

// Tìm kiếm nhà xuất bản
router.get('/search', nhaXuatBanController.searchNhaXuatBan);

// Lấy thông tin nhà xuất bản theo ID
router.get('/:id', nhaXuatBanController.getNhaXuatBanById);

// Lấy thông tin nhà xuất bản theo mã
router.get('/ma/:maNXB', nhaXuatBanController.getNhaXuatBanByMa);

// Lấy danh sách sách theo nhà xuất bản
router.get('/:id/sach', nhaXuatBanController.getSachByNhaXuatBan);

// Yêu cầu quyền nhân viên hoặc admin cho các route sau
router.use(authMiddleware.restrictTo('nhanvien', 'admin'));

// Thêm nhà xuất bản mới
router.post('/', nhaXuatBanController.createNhaXuatBan);

// Cập nhật thông tin nhà xuất bản
router.put('/:id', nhaXuatBanController.updateNhaXuatBan);

// Xóa nhà xuất bản
router.delete('/:id', nhaXuatBanController.deleteNhaXuatBan);

// Kiểm tra mã nhà xuất bản đã tồn tại
// router.get('/check/:maNXB', nhaXuatBanController.checkMaNXBExists);

module.exports = router;