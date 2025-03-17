const mongoose = require('mongoose');

const danhMucSachSchema = new mongoose.Schema({
    MaDanhMuc: { type: String, required: true, unique: true },
    TenDanhMuc: { type: String, required: true }
});

const DanhMucSach = mongoose.model('DanhMucSach', danhMucSachSchema);
module.exports = DanhMucSach;