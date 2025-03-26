const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
    MaSach: { type: String, required: true, unique: true },
    TenSach: { type: String, required: true, unique: true },
    MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan', required: true},
    MaDanhMuc: { type: mongoose.Schema.Types.ObjectId, ref: 'DanhMucSach', required: true},
    DonGia: { type: Number },
    SoQuyen: { type: Number, default: 1 },
    NamXuatBan: { type: Number },
    TacGia: { type: String },
    HinhAnh: { type: String }
});

// Phương thức kiểm tra sách còn có thể mượn được không
sachSchema.methods.coTheMuon = function () {
    // Giả sử bạn có một phương thức để đếm số sách đang được mượn
    // Trả về true nếu số sách còn lại > 0
    return this.SoQuyen > 0;
};

const Sach = mongoose.model('Sach', sachSchema);
module.exports = Sach;