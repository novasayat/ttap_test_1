const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     category: { type: String, required: true, enum: ["student", "faculty"] },
//     wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
// });

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    category: { type: String, required: true, enum: ["student", "faculty"] },
    wishlist: [{
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
    }]
  });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("users", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        category: Joi.string().valid("student", "faculty").required().label("Category")
    });
    return schema.validate(data);
};

module.exports = { User, validate };