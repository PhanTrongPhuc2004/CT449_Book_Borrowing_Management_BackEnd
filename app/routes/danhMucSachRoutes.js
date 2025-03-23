// routes/danhMucSachRoutes.js
const express = require('express');
const router = express.Router();
const danhMucSachController = require('../controllers/danhMucSachController');
const authController = require('../controllers/xacThucController');


// Lấy danh sách tất cả danh mục sách
router.get('/', danhMucSachController.getAllDanhMucSach);

// Lấy chi tiết một danh mục sách theo ID
router.get('/:id', danhMucSachController.getDanhMucSachById);

// Lấy danh mục sách theo mã
router.get('/ma/:maDanhMuc', danhMucSachController.getDanhMucSachByMa);

// Tìm kiếm danh mục sách theo tên
router.get('/search/keyword', danhMucSachController.searchDanhMucSach);

// Lấy tất cả sách thuộc một danh mục
router.get('/sach/:maDanhMuc', danhMucSachController.getSachByDanhMuc);

// Kiểm tra danh mục sách tồn tại
router.get('/check/:maDanhMuc', danhMucSachController.checkDanhMucExists);

// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);
router.use(authController.restrictTo('nhanvien'));

// Tạo danh mục sách mới (chỉ admin và thủ thư)
router.post('/',danhMucSachController.createDanhMucSach);

// Cập nhật thông tin danh mục sách (chỉ admin và thủ thư)
router.put('/:id',danhMucSachController.updateDanhMucSach);

// Xóa danh mục sách (chỉ admin)
router.delete('/:id',danhMucSachController.deleteDanhMucSach);

module.exports = router;