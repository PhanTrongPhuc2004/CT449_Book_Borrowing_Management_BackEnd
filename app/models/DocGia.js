const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//DocGiaModel
const docGiaSchema = new mongoose.Schema({
    MaDG: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: String },
    Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
    DiaChi: { type: String },
    DienThoai: { type: String }
});

// Tạo fullName từ HoLot và Ten
docGiaSchema.virtual('HoTen').get(function () {
    return `${this.HoLot} ${this.Ten}`;
});

// Phương thức kiểm tra mật khẩu
docGiaSchema.methods.kiemTraMatKhau = async function (matKhauNhap, matKhauLuu) {
    return await bcrypt.compare(matKhauNhap, matKhauLuu);
};

const DocGia = mongoose.model('DocGia', docGiaSchema);
module.exports = DocGia;