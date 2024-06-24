require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");    //line 33 userRoutes.js
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");  //line 11 in students.js

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());           // we can futher enhance security by creating and allowing a custom cors Origins

// routes
app.use("/api/users", userRoutes);   // creating the base path to form complete route from userRoutes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
