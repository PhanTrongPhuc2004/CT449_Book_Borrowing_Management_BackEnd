const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    MaDG: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    NgayMuon: { type: Date, default: Date.now },
    NgayTra: { type: Date },
    TrangThai: {
        type: String,
        enum: ['Đang mượn', 'Đã trả', 'Quá hạn'],
        default: 'Đang mượn'
    }
});
    
const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
module.exports = TheoDoiMuonSach;