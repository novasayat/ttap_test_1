const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const { User } = require("../models/user");
const auth = require("../middleware/authMiddleware");
const atob = require('atob'); // to decode Base64 encoded string
const nodemailer = require('nodemailer'); // Import nodemailer
const sgMail = require('@sendgrid/mail'); // Import SendGrid


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

// Assign hours to a student
router.post("/assign-hours", auth, async (req, res) => {
  try {
    const { studentId, hours } = req.body;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    const availableHours = student.hoursAtSmith + (student.assignedHours || 0);
    if (hours > availableHours) {
      return res.status(400).send({ message: "Assigned hours exceed available hours" });
    }

    student.hoursAtSmith = availableHours - hours;
    student.assignedHours = hours;

    await student.save();

    res.status(200).send(student);
  } catch (error) {
    console.error("Error assigning hours:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// route to send an email

router.post('/send-email', auth, async (req, res) => {
  const { student, email, fullName } = req.body;
  const appPassword = 'hwso ciqy jpzr soms'; // Your generated app password

  try {
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use any email service
      auth: {
        user: email, // Use the logged-in user's email
        pass: appPassword, // Use the app password
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.log('Error configuring email server:', error);
        res.status(500).send({ message: 'Email server configuration error.' });
        return;
      } else {
        console.log('Email server is ready to take our messages');
      }
    });

    // Setup email data
    let mailOptions = {
      from: `"Smith Part Time" <${email}>`, // Sender address
      to: student.email, // List of receivers
      subject: 'Interview Invitation', // Subject line
      text: `Dear ${student.fullName},\n\nYou have been selected for an interview call with Professor ${fullName}. Kindly check the available timings of the professor and block their calendar through Google Calendar to schedule a meet with the professor.\n\nBest Regards,\nSmith Part Time Team`,
      html: `<p>Dear ${student.fullName},</p>
             <p>You have been selected for an interview call with Professor ${fullName}. Kindly check the available timings of the professor and block their calendar through Google Calendar to schedule a meet with the professor.</p>
             <p>Best Regards,<br>Smith Part Time Team</p>`
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


/**************************************** BACK UP OPTION TO SEND AN EMAIL ****************************************************/

// Set SendGrid API key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Make sure to set your SendGrid API key in your environment variables

// router.post('/send-email', auth, async (req, res) => {
//   const { student, email } = req.body;
//   try {
//     // Setup email data
//     const msg = {
//       to: student.email, // Recipient's email
//       from: email, // Sender address
//       subject: 'Invitation',
//       text: `Dear ${student.fullName},\n\nWe would like to invite you to join our team.\n\nBest Regards,\nYour Company Name`,
//     };

//     console.log(email);
//     console.log(student.email);
//     // Send email
//     await sgMail.send(msg);

//     res.status(200).send({ message: 'Email sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send({ message: 'Internal Server Error' });
//   }
// });

/**************************************** BACK UP OPTION TO SEND AN EMAIL ****************************************************/

module.exports = router;