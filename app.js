const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Default route
// This route is used to test if the server is running
app.get("/", (req, res) => {
    res.send("Book_Borrowing_Management_BackEnd is running");
});

module.exports = app;