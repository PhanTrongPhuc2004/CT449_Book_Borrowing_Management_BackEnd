const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//NhanVienModel
const nhanVienSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    ChucVu: { type: String },
    DiaChi: { type: String },
    SoDienThoai: { type: String }
});

// Tạo fullName từ HoLot và Ten
nhanVienSchema.virtual('HoTen').get(function () {
    return `${this.HoLot} ${this.Ten}`;
});

// Phương thức kiểm tra mật khẩu
nhanVienSchema.methods.kiemTraMatKhau = async function (matKhauNhap, matKhauLuu) {
    return await bcrypt.compare(matKhauNhap, matKhauLuu);
};

// return matKhauNhap === matKhauLuu;
const NhanVien = mongoose.model('NhanVien', nhanVienSchema);
module.exports = NhanVien;