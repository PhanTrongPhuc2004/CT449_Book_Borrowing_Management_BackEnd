// muonTraController.js
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const DocGia = require('../models/DocGia');
const Sach = require('../models/Sach');

// Lấy tất cả thông tin mượn sách
exports.getAll = async (req, res, next) => {
    try {
        const theoDoiList = await TheoDoiMuonSach.find()
        res.json({
            status: 'success',
            data: theoDoiList
        });
    } catch (error) {
        next(error);
    }

}

// Mượn sách
exports.yeucaumuonSach = async (req, res, next) => {
    try {
        const { MaDG, MaSach } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaDG || !MaSach) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp mã độc giả và mã sách'
            });
        }

        // Kiểm tra độc giả có tồn tại
        const docGia = await DocGia.findOne({ MaDG });
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }

        // Kiểm tra số lượng sách đang mượn của độc giả
        const soSachDangMuon = await TheoDoiMuonSach.countDocuments({
            MaDG: docGia._id,
            TrangThai: 'Đang mượn'
        });
        const soSachDangYeuCauMuon = await TheoDoiMuonSach.countDocuments({
            MaDG: docGia._id,
            TrangThai: 'Yêu cầu'
        });
        if ((soSachDangMuon + soSachDangYeuCauMuon) >= 5) {
            return res.status(400).json({
                status: 'fail',
                message: 'Bạn đã mượn và yêu cầu 5 quyển sách, không thể yêu cầu mượn thêm!'
            });
        }

        // Kiểm tra sách có tồn tại
        const sach = await Sach.findOne({ MaSach });
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }

        // Kiểm tra sách còn có thể mượn được không
        if (sach.SoQuyen <= 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sách này hiện không còn để mượn'
            });
        }

        // Tạo bản ghi mượn sách mới
        const muonSach = new TheoDoiMuonSach({
            MaDG: docGia._id,
            MaSach: sach._id,
            NgayMuon: new Date(),
            NgayTra: null,
            TrangThai: 'Yêu cầu'
        });

        await muonSach.save();

        // Cập nhật số lượng sách
        // console.log('Trước khi cập nhật:', sach.SoQuyen);
        sach.SoQuyen -= 1;
        // console.log('Sau khi cập nhật:', sach.SoQuyen);
        await sach.save();
        // console.log('Đã lưu vào DB:', sach.SoQuyen);

        res.status(201).json({
            status: 'success',
            data: { muonSach }
        });
    } catch (err) {
        next(err);
    }
};

// Trả sách
exports.traSach = async (req, res, next) => {
    try {
        const { MaDG, MaSach } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaDG || !MaSach) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp mã độc giả và mã sách'
            });
        }

        // Kiểm tra độc giả
        const docGia = await DocGia.findOne({ MaDG });
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }

        // Kiểm tra sách
        const sach = await Sach.findOne({ MaSach });
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }
        
        // Tìm bản ghi mượn sách
        const muonSach = await TheoDoiMuonSach.findOne({
            MaDG: docGia._id,
            MaSach: sach._id,
            NgayTra: null
        });
        // console.log(sach,docGia,muonSach);

        if (!muonSach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy thông tin mượn sách này'
            });
        }

        // Cập nhật ngày trả và trạng thái
        muonSach.NgayTra = new Date();
        muonSach.TrangThai = 'Đã trả';
        await muonSach.save();

        // Tăng số lượng sách
        sach.SoQuyen += 1;
        await sach.save();

        res.status(200).json({
            status: 'success',
            data: { traSach: muonSach }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy danh sách sách đang mượn
exports.danhSachDangMuon = async (req, res, next) => {
    try {
        const query = { NgayTra: null };

        // Nếu có filter theo MaDocGia
        if (req.query.MaDG) {
            const docGia = await DocGia.findOne({ MaDocGia: req.query.MaDG });
            if (docGia) {
                query.MaDG = docGia._id;
            }
        }

        // Lấy danh sách mượn sách
        const danhSach = await TheoDoiMuonSach.find(query)
            // .populate({
            //     path: 'MaDocGia',
            //     select: 'MaDocGia HoLot Ten DienThoai'
            // })
            // .populate({
            //     path: 'MaSach',
            //     select: 'MaSach TenSach MaDanhMuc',
            //     populate: { path: 'MaDanhMuc', select: 'TenDanhMuc' }
            // });

        res.status(200).json({
            status: 'success',
            results: danhSach.length,
            data: { danhSachMuon: danhSach }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy danh sách sách quá hạn
exports.danhSachQuaHan = async (req, res, next) => {
    try {
        // Lấy danh sách tất cả sách đang mượn
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

        res.status(200).json({
            status: 'success',
            results: danhSachQuaHan.length,
            data: { danhSachQuaHan }
        });
    } catch (err) {
        next(err);
    }
};

// Lấy lịch sử mượn sách của một độc giả
exports.lichSuMuonCuaDocGia = async (req, res, next) => {
    try {
        const { MaDocGia } = req.params;

        // Kiểm tra dữ liệu đầu vào
        if (!MaDocGia) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp mã độc giả'
            });
        }

        // Tìm độc giả
        const docGia = await DocGia.findOne({ MaDocGia });
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }

        // Lấy lịch sử mượn sách
        const lichSu = await TheoDoiMuonSach.find({ MaDocGia: docGia._id })
            .populate({
                path: 'MaSach',
                select: 'MaSach TenSach MaDanhMuc',
                populate: { path: 'MaDanhMuc', select: 'TenDanhMuc' }
            })
            .sort({ NgayMuon: -1 });

        res.status(200).json({
            status: 'success',
            results: lichSu.length,
            data: { lichSuMuon: lichSu }
        });
    } catch (err) {
        next(err);
    }
};

// Xóa thông tin mượn sách
exports.xoaYeuCauMuonSach = async (req, res, next) => {
    try {
        const { MaDG, MaSach } = req.body;
        console.log(MaDG, MaSach);
        // Kiểm tra dữ liệu đầu vào
        if (!MaDG || !MaSach) {
            return res.status(400).json({
                status: 'fail',
                message: 'Vui lòng cung cấp mã độc giả và mã sách'
            });
        }

        // Kiểm tra độc giả
        const docGia = await DocGia.findOne({ MaDG });
        if (!docGia) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy độc giả với mã này'
            });
        }

        // Kiểm tra sách
        const sach = await Sach.findOne({ MaSach });
        if (!sach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy sách với mã này'
            });
        }

        // Tìm bản ghi mượn sách
        const muonSach = await TheoDoiMuonSach.findOne({
            MaDG: docGia._id,
            MaSach: sach._id,
            NgayTra: null
        });

        if (!muonSach) {
            return res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy thông tin mượn sách này'
            });
        }

        // Xóa thông tin mượn sách
        await TheoDoiMuonSach.findByIdAndDelete(muonSach._id);

        // Tăng số lượng sách
        sach.SoQuyen += 1;
        await sach.save();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};