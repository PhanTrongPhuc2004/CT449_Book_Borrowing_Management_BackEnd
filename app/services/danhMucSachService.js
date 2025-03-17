// services/danhMucSachService.js
const DanhMucSach = require('../models/DanhMucSach');
const Sach = require('../models/Sach');

/**
 * Service đảm nhiệm xử lý logic cho danh mục sách
 */
class DanhMucSachService {
    /**
     * Lấy tất cả danh mục sách
     * @param {Object} options - Tùy chọn sắp xếp và lọc
     * @returns {Promise<Array>} Danh sách các danh mục sách
     */
    async getAllDanhMucSach(options = {}) {
        try {
            const { sortField = 'TenDanhMuc', sortOrder = 1 } = options;
            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            return await DanhMucSach.find().sort(sortOptions);
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách danh mục sách: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin danh mục sách theo ID
     * @param {String} id - ID của danh mục sách
     * @returns {Promise<Object>} Thông tin danh mục sách
     */
    async getDanhMucSachById(id) {
        try {
            const danhMuc = await DanhMucSach.findById(id);
            if (!danhMuc) {
                throw new Error('Không tìm thấy danh mục sách với ID này');
            }
            return danhMuc;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin danh mục sách: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin danh mục sách theo mã danh mục
     * @param {String} maDanhMuc - Mã của danh mục sách
     * @returns {Promise<Object>} Thông tin danh mục sách
     */
    async getDanhMucSachByMa(maDanhMuc) {
        try {
            const danhMuc = await DanhMucSach.findOne({ MaDanhMuc: maDanhMuc });
            if (!danhMuc) {
                throw new Error('Không tìm thấy danh mục sách với mã này');
            }
            return danhMuc;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin danh mục sách: ${error.message}`);
        }
    }

    /**
     * Tạo danh mục sách mới
     * @param {Object} danhMucData - Dữ liệu danh mục sách mới
     * @returns {Promise<Object>} Danh mục sách đã được tạo
     */
    async createDanhMucSach(danhMucData) {
        try {
            // Kiểm tra mã danh mục đã tồn tại chưa
            const existingDanhMuc = await DanhMucSach.findOne({ MaDanhMuc: danhMucData.MaDanhMuc });
            if (existingDanhMuc) {
                throw new Error('Mã danh mục sách này đã tồn tại');
            }

            return await DanhMucSach.create(danhMucData);
        } catch (error) {
            throw new Error(`Lỗi khi tạo danh mục sách mới: ${error.message}`);
        }
    }

    /**
     * Cập nhật thông tin danh mục sách
     * @param {String} id - ID của danh mục sách cần cập nhật
     * @param {Object} danhMucData - Dữ liệu cập nhật
     * @returns {Promise<Object>} Danh mục sách đã được cập nhật
     */
    async updateDanhMucSach(id, danhMucData) {
        try {
            // Nếu cập nhật MaDanhMuc, kiểm tra xem mã mới đã tồn tại chưa
            if (danhMucData.MaDanhMuc) {
                const existingDanhMuc = await DanhMucSach.findOne({
                    MaDanhMuc: danhMucData.MaDanhMuc,
                    _id: { $ne: id }
                });

                if (existingDanhMuc) {
                    throw new Error('Mã danh mục sách này đã tồn tại');
                }
            }

            const danhMuc = await DanhMucSach.findByIdAndUpdate(
                id,
                danhMucData,
                { new: true, runValidators: true }
            );

            if (!danhMuc) {
                throw new Error('Không tìm thấy danh mục sách với ID này');
            }

            return danhMuc;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật danh mục sách: ${error.message}`);
        }
    }

    /**
     * Xóa danh mục sách
     * @param {String} id - ID của danh mục sách cần xóa
     * @returns {Promise<Boolean>} Kết quả xóa danh mục
     */
    async deleteDanhMucSach(id) {
        try {
            const danhMuc = await DanhMucSach.findById(id);
            if (!danhMuc) {
                throw new Error('Không tìm thấy danh mục sách với ID này');
            }

            // Kiểm tra xem có sách nào thuộc danh mục này không
            const relatedBooks = await Sach.findOne({ MaDanhMuc: danhMuc.MaDanhMuc });
            if (relatedBooks) {
                throw new Error('Không thể xóa danh mục sách này vì đang có sách thuộc danh mục');
            }

            await DanhMucSach.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error(`Lỗi khi xóa danh mục sách: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả sách thuộc một danh mục
     * @param {String} maDanhMuc - Mã danh mục sách
     * @param {Object} options - Tùy chọn sắp xếp và phân trang
     * @returns {Promise<Array>} Danh sách sách thuộc danh mục
     */
    async getSachByDanhMuc(maDanhMuc, options = {}) {
        try {
            const {
                sortField = 'TenSach',
                sortOrder = 1,
                page = 1,
                limit = 10
            } = options;

            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            const skip = (page - 1) * limit;

            const sachList = await Sach.find({ MaDanhMuc: maDanhMuc })
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Sach.countDocuments({ MaDanhMuc: maDanhMuc });

            return {
                data: sachList,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách sách theo danh mục: ${error.message}`);
        }
    }

    /**
     * Tìm kiếm danh mục sách
     * @param {Object} searchParams - Thông số tìm kiếm
     * @returns {Promise<Array>} Kết quả tìm kiếm
     */
    async searchDanhMucSach(searchParams) {
        try {
            const { keyword, sortField = 'TenDanhMuc', sortOrder = 1 } = searchParams;

            const query = {};
            if (keyword) {
                query.$or = [
                    { MaDanhMuc: new RegExp(keyword, 'i') },
                    { TenDanhMuc: new RegExp(keyword, 'i') }
                ];
            }

            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            return await DanhMucSach.find(query).sort(sortOptions);
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm danh mục sách: ${error.message}`);
        }
    }

    /**
     * Kiểm tra sự tồn tại của danh mục sách
     * @param {String} maDanhMuc - Mã danh mục cần kiểm tra
     * @returns {Promise<Boolean>} Kết quả kiểm tra
     */
    async checkDanhMucExists(maDanhMuc) {
        try {
            const danhMuc = await DanhMucSach.findOne({ MaDanhMuc: maDanhMuc });
            return danhMuc ? true : false;
        } catch (error) {
            throw new Error(`Lỗi khi kiểm tra danh mục sách: ${error.message}`);
        }
    }

    /**
     * Đếm số lượng sách trong từng danh mục
     * @returns {Promise<Array>} Danh sách danh mục và số lượng sách
     */
    async countSachByDanhMuc() {
        try {
            const danhMucList = await DanhMucSach.find();

            const result = await Promise.all(danhMucList.map(async (danhMuc) => {
                const count = await Sach.countDocuments({ MaDanhMuc: danhMuc.MaDanhMuc });
                return {
                    _id: danhMuc._id,
                    MaDanhMuc: danhMuc.MaDanhMuc,
                    TenDanhMuc: danhMuc.TenDanhMuc,
                    soLuongSach: count
                };
            }));

            return result;
        } catch (error) {
            throw new Error(`Lỗi khi đếm số lượng sách theo danh mục: ${error.message}`);
        }
    }
}

module.exports = new DanhMucSachService();