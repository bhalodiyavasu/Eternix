const express = require('express');
const cores = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cores({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

//Test route
app.get("/", (req, res) => {
  res.send("Hello From Server 🚀");
});

module.exports = app;