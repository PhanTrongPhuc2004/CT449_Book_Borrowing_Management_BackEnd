const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const DocGia = require('../models/DocGia');
const Sach = require('../models/Sach');

// Mượn sách
exports.muonSach = async (MaDocGia, MaSach) => {
    // Kiểm tra độc giả có tồn tại
    const docGia = await DocGia.findOne({ MaDocGia });
    if (!docGia) {
        throw new Error('Không tìm thấy độc giả với mã này');
    }

    // Kiểm tra sách có tồn tại
    const sach = await Sach.findOne({ MaSach });
    if (!sach) {
        throw new Error('Không tìm thấy sách với mã này');
    }

    // Kiểm tra sách còn có thể mượn được không
    if (sach.SoQuyen <= 0) {
        throw new Error('Sách này hiện không còn để mượn');
    }

    // Kiểm tra độc giả có đang mượn sách này không
    const dangMuon = await TheoDoiMuonSach.findOne({
        MaDocGia: docGia._id,
        MaSach: sach._id,
        NgayTra: null
    });

    if (dangMuon) {
        throw new Error('Độc giả đang mượn sách này');
    }

    // Tạo bản ghi mượn sách mới
    const muonSach = new TheoDoiMuonSach({
        MaDocGia: docGia._id,
        MaSach: sach._id,
        NgayMuon: new Date(),
        NgayTra: null,
        TrangThai: 'Đang mượn'
    });

    await muonSach.save();

    // Cập nhật số lượng sách
    sach.SoQuyen -= 1;
    await sach.save();

    return muonSach;
};

// Trả sách
exports.traSach = async (MaDocGia, MaSach) => {
    // Kiểm tra độc giả
    const docGia = await DocGia.findOne({ MaDocGia });
    if (!docGia) {
        throw new Error('Không tìm thấy độc giả với mã này');
    }

    // Kiểm tra sách
    const sach = await Sach.findOne({ MaSach });
    if (!sach) {
        throw new Error('Không tìm thấy sách với mã này');
    }

    // Tìm bản ghi mượn sách
    const muonSach = await TheoDoiMuonSach.findOne({
        MaDocGia: docGia._id,
        MaSach: sach._id,
        NgayTra: null
    });

    if (!muonSach) {
        throw new Error('Không tìm thấy thông tin mượn sách này');
    }

    // Cập nhật ngày trả và trạng thái
    muonSach.NgayTra = new Date();
    muonSach.TrangThai = 'Đã trả';
    await muonSach.save();

    // Tăng số lượng sách
    sach.SoQuyen += 1;
    await sach.save();

    return muonSach;
};

// Lấy danh sách sách đang mượn
exports.danhSachDangMuon = async (filter = {}) => {
    const query = { NgayTra: null };

    if (filter.MaDocGia) {
        const docGia = await DocGia.findOne({ MaDocGia: filter.MaDocGia });
        if (docGia) {
            query.MaDocGia = docGia._id;
        }
    }

    return await TheoDoiMuonSach.find(query)
        .populate({
            path: 'MaDocGia',
            select: 'MaDocGia HoLot Ten DienThoai'
        })
        .populate({
            path: 'MaSach',
            select: 'MaSach TenSach MaDanhMuc',
            populate: { path: 'MaDanhMuc', select: 'TenDanhMuc' }
        });
};

// Lấy danh sách sách quá hạn
exports.danhSachQuaHan = async () => {
    const danhSachMuon = await TheoDoiMuonSach.find({ NgayTra: null })
        .populate({
            path: 'MaDocGia',
            select: 'MaDocGia HoLot Ten DienThoai'
        })
        .populate({
            path: 'MaSach',
            select: 'MaSach TenSach MaDanhMuc',
            populate: { path: 'MaDanhMuc', select: 'TenDanhMuc' }
        });

    // Lọc những bản ghi quá hạn (giả sử thời hạn mượn là 14 ngày)
    const today = new Date();
    const danhSachQuaHan = danhSachMuon.filter(item => {
        const ngayMuon = new Date(item.NgayMuon);
        const hanTra = new Date(ngayMuon);
        hanTra.setDate(hanTra.getDate() + 14);

        return today > hanTra;
    });

    // Cập nhật trạng thái quá hạn
    for (const item of danhSachQuaHan) {
        if (item.TrangThai !== 'Quá hạn') {
            item.TrangThai = 'Quá hạn';
            await item.save();
        }
    }

    return danhSachQuaHan;
};

// Lấy lịch sử mượn của một độc giả
exports.lichSuMuonCuaDocGia = async (MaDocGia) => {
    const docGia = await DocGia.findOne({ MaDocGia });
    if (!docGia) {
        throw new Error('Không tìm thấy độc giả với mã này');
    }

    return await TheoDoiMuonSach.find({ MaDocGia: docGia._id })
        .populate({
            path: 'MaSach',
            select: 'MaSach TenSach MaDanhMuc',
            populate: { path: 'MaDanhMuc', select: 'TenDanhMuc' }
        })
        .sort({ NgayMuon: -1 });
};