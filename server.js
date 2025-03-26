const mongoose = require('mongoose');
const app = require('./app');
const config = require('./app/config');

// Xử lý lỗi không bắt được
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Kết nối database
mongoose
    .connect(config.databaseUrl, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() => console.log('Kết nối database thành công!'));

// Khởi động server
const port = config.app.port;
const server = app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});

// Xử lý lỗi không bắt được trong Promise
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});