// require('dotenv').config()
// const cors = require('cors')
// const dns = require("dns")
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// const express = require('express');
// const app = express()
// const { dbConnect } = require('./config/db');
// dbConnect()
// app.use(express.json())

// const router = require("./router")

// app.use(router)


// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;

//   apiResponse(res, statusCode, err.message || 'Internal Server Error');
// });



// module.exports = app




require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');

const app = express();

// DNS Configuration
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Database Connection
const { dbConnect } = require('./config/db');
dbConnect();

// Routes
const router = require("./router");
app.use(router);

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
