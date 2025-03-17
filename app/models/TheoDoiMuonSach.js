const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    MaDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    NgayMuon: { type: Date, default: Date.now },
    NgayTra: { type: Date },
    TrangThai: {
        type: String,
        enum: ['Đang mượn', 'Đã trả', 'Quá hạn'],
        default: 'Đang mượn'
    }
});

// Tính số ngày quá hạn (nếu có)
theoDoiMuonSachSchema.methods.tinhSoNgayQuaHan = function () {
    if (!this.NgayTra) {
        const today = new Date();
        const dueDate = new Date(this.NgayMuon);
        dueDate.setDate(dueDate.getDate() + 14); // Giả sử thời gian mượn là 14 ngày

        if (today > dueDate) {
            const diffTime = Math.abs(today - dueDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }
    return 0;
};

const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
module.exports = TheoDoiMuonSach;