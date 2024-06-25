const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const { User } = require("../models/user");
const auth = require("../middleware/authMiddleware");

// Get all students
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get unique filter values
router.get("/filters", auth, async (req, res) => {
  try {
    const degrees = await Student.distinct("degree");
    const courseNames = await Student.distinct("courseName");
    const enrollmentDates = await Student.distinct("enrollmentDate");
    const areasOfInterest = await Student.distinct("areasOfInterest");
    const hoursAtSmith = await Student.distinct("hoursAtSmith");

    res.status(200).send({
      degree: degrees,
      courseName: courseNames,
      enrollmentDate: enrollmentDates,
      areasOfInterest: areasOfInterest,
      hoursAtSmith: hoursAtSmith
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get wishlist for a user
router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user.wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update wishlist for a user
router.post("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.wishlist = req.body.wishlist;
    await user.save();
    res.status(200).send(user.wishlist);
  } catch (error) {
    console.error("Error updating wishlist:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get hired students for a user
router.get("/hired", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user.hired);
  } catch (error) {
    console.error("Error fetching hired students:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Hire a student
router.post("/hire", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.hired.push(req.body.student);
    await user.save();
    res.status(200).send(user.hired);
  } catch (error) {
    console.error("Error hiring student:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
