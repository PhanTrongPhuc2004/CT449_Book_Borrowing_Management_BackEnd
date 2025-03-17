const Sach = require('../models/Sach');

// Lấy tất cả sách, có thể lọc theo query
exports.getAllSach = async (query = {}) => {
    const filter = {};

    if (query.TenSach) {
        filter.TenSach = { $regex: query.TenSach, $options: 'i' };
    }

    if (query.MaDanhMuc) {
        filter.MaDanhMuc = query.MaDanhMuc;
    }

    if (query.MaNXB) {
        filter.MaNXB = query.MaNXB;
    }

    if (query.NamXuatBan) {
        filter.NamXuatBan = query.NamXuatBan;
    }

    const sach = await Sach.find(filter)
        .populate('MaNXB', 'TenNXB')
        .populate('MaDanhMuc', 'TenDanhMuc');

    return sach;
};

// Lấy sách theo mã
exports.getSachByMa = async (MaSach) => {
    return await Sach.findOne({ MaSach })
        .populate('MaNXB', 'TenNXB')
        .populate('MaDanhMuc', 'TenDanhMuc');
};

// Thêm sách mới
exports.createSach = async (sachData) => {
    const newSach = new Sach(sachData);
    return await newSach.save();
};

// Cập nhật thông tin sách
exports.updateSach = async (MaSach, sachData) => {
    return await Sach.findOneAndUpdate({ MaSach }, sachData, {
        new: true,
        runValidators: true
    });
};

// Xóa sách
exports.deleteSach = async (MaSach) => {
    return await Sach.findOneAndDelete({ MaSach });
};

// Tìm kiếm sách
exports.searchSach = async (searchQuery) => {
    const query = {};

    if (searchQuery.keyword) {
        query.$or = [
            { TenSach: { $regex: searchQuery.keyword, $options: 'i' } },
            { NguonGoc: { $regex: searchQuery.keyword, $options: 'i' } }
        ];
    }

    return await Sach.find(query)
        .populate('MaNXB', 'TenNXB')
        .populate('MaDanhMuc', 'TenDanhMuc');
};