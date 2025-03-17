const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    MaDocGia: { type: String, required: true, unique: true },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: Date },
    Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
    DiaChi: { type: String },
    DienThoai: { type: String }
});

// Tạo fullName từ HoLot và Ten
docGiaSchema.virtual('HoTen').get(function () {
    return `${this.HoLot} ${this.Ten}`;
});

const DocGia = mongoose.model('DocGia', docGiaSchema);
module.exports = DocGia;