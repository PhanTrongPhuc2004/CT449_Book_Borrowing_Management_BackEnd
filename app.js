const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require("cors");
const config = require('./app/config');

// Import routes
const docGiaRoutes = require('./app/routes/docGiaRoutes');
const sachRoutes = require('./app/routes/sachRoutes');
const nhaXuatBanRoutes = require('./app/routes/nhaXuatBanRoutes');
const muonTraRoutes = require('./app/routes/muonTraRoutes');
const nhanVienRoutes = require('./app/routes/nhanVienRoutes');
const danhMucSachRoutes = require('./app/routes/danhMucSachRoutes');
const authRoutes = require('./app/routes/xacThucRoutes');

// Logger
const app = express();

// Middleware
app.use(morgan('dev')); // Ghi log request
app.use(express.json()); // Xử lý JSON
app.use(express.urlencoded({ extended: true })); // Xử lý form data
app.use(cors()); // Cho phép CORS

// Routes
app.use('/api/docgia', docGiaRoutes);
app.use('/api/sach', sachRoutes);
app.use('/api/nhaxuatban', nhaXuatBanRoutes);
app.use('/api/muontra', muonTraRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/danhmuc', danhMucSachRoutes);
app.use('/api/auth', authRoutes);

// Route mặc định
app.get("/", (req, res) => {
    res.send("Book_Borrowing_Management_BackEnd is running");
});

// Middleware xử lý lỗi
app.use((req, res, next) => {
    const error = new Error('Không tìm thấy trang');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;