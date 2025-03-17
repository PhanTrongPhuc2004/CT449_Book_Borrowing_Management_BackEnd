const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
    MaNXB: { type: String, required: true, unique: true },
    TenNXB: { type: String, required: true },
    DiaChi: { type: String }
});

const NhaXuatBan = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
module.exports = NhaXuatBan;