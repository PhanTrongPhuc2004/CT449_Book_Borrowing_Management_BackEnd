const dotenv = require('dotenv');

// Load biến môi trường từ file .env
dotenv.config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/quanlymuonsachthuvien',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRES_IN || '90d',
    muonSach: {
        thoiHanMuon: process.env.THOI_HAN_MUON || 14, // 14 ngày
        soSachToiDa: process.env.SO_SACH_TOI_DA || 5 // 5 quyển
    },
    tienPhat: {
        mucPhatMoiNgay: process.env.MUC_PHAT_MOI_NGAY || 5000 // 5000 VND/ngày
    }
};