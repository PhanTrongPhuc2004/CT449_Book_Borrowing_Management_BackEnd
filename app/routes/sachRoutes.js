const express = require('express');
const sachController = require('../controllers/sachController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Routes công khai
router.get('/', sachController.getAllSach);
router.get('/search', sachController.searchSach);
router.get('/:MaSach', sachController.getSachByMa);

// Routes yêu cầu xác thực
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin', 'thủ thư'));

router.post('/', sachController.createSach);
router.put('/:MaSach', sachController.updateSach);
router.delete('/:MaSach', sachController.deleteSach);

module.exports = router;