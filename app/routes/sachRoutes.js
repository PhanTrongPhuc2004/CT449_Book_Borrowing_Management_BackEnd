const express = require('express');
const sachController = require('../controllers/sachController');
const authController = require('../controllers/xacThucController');

const router = express.Router();

// lấy tất cả sách
router.get('/', sachController.getAllSach);

// Tìm kiếm sách theo id
router.get('/:id', sachController.getSachById);

// Tìm kiếm sách theo mã
router.get('/ma/:MaSach', sachController.getSachByMa);

// Route bảo vệ - yêu cầu xác thực
router.use(authController.protect);
router.use(authController.restrictTo('nhanvien'));

router.post('/', sachController.createSach);
router.put('/:id', sachController.updateSach);
router.delete('/:id', sachController.deleteSach);

module.exports = router;