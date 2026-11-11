require('dotenv').config()
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const app = express()
const { dbConnect } = require('./config/db');
dbConnect()
app.use(express.json())

const router = require("./router")

app.use(router)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  apiResponse(res, statusCode, err.message || 'Internal Server Error');
});



module.exports = app