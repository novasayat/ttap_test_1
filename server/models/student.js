const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  uid: { type: Number, required: true },
  degree: { type: String, required: true },
  courseName: { type: String, required: true },
  enrollmentDate: { type: String, required: true },
  graduationDate: { type: Date, required: true },
  email: { type: String, required: true },
  education: { type: String, required: true },
  workExperience: { type: String, required: true },
  areasOfInterest: { type: String, required: true },
  hoursAtSmith: { type: Number, required: true },
  hoursOtherJobs: { type: Number, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String, required: true }
});

const Student = mongoose.model("studentprofiles", studentSchema);

module.exports = Student;