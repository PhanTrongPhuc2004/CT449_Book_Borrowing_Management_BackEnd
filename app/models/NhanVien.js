const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nhanVienSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String },
    DiaChi: { type: String },
    SoDienThoai: { type: String }
});

// Mã hóa mật khẩu trước khi lưu
nhanVienSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();

    this.Password = await bcrypt.hash(this.Password, 12);
    next();
});

// Phương thức kiểm tra mật khẩu
nhanVienSchema.methods.kiemTraMatKhau = async function (matKhauNhap, matKhauLuu) {
    return await bcrypt.compare(matKhauNhap, matKhauLuu);
};

const NhanVien = mongoose.model('NhanVien', nhanVienSchema);
module.exports = NhanVien;