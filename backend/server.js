require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(cors());

app.use(express.json());

/*
==================================================
PDF UPLOAD
==================================================
*/

const upload = multer({
  dest: "uploads/",
});

/*
==================================================
OPENROUTER GEMINI
==================================================
*/

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/*
==================================================
TEST ROUTE
==================================================
*/

app.get("/", (req, res) => {
  res.send("AI Server Running");
});


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpStorage = {};
const otpExpiry = {};

const axios = require("axios");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = mongoose.model(
  "User",
  userSchema
);

/*
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
*/

/*
==================================================
SEND OTP
==================================================
*/

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    otpStorage[email] = otp;
    otpExpiry[email] =
  Date.now() + 5 * 60 * 1000;

await axios.post(
  "https://api.brevo.com/v3/smtp/email",
  {
    sender: {
      name: "AI Study Planner",
      email: process.env.EMAIL_USER,
    },

    to: [
      {
        email: email,
      },
    ],

    subject:
      "AI Study Planner OTP Verification",

    htmlContent: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `,
  },
  {
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
  }
);
    console.log("OTP SENT =>", otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    console.log(
      "OTP ERROR =>",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

/*
==================================================
SIGNUP
==================================================
*/

app.post("/api/auth/signup", async (req, res) => {
  try {

    const {
      fullName,
      email,
      password,
      otp,
    } = req.body;

if (!otpStorage[email]) {

  return res.status(400).json({
    success: false,
    message: "OTP expired",
  });
}

if (Date.now() > otpExpiry[email]) {

  delete otpStorage[email];
  delete otpExpiry[email];

  return res.status(400).json({
    success: false,
    message: "OTP expired",
  });
}

if (otpStorage[email] !== otp) {

  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
}

const existingUser =
  await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

const user = new User({
  fullName,
  email,
  password: hashedPassword,
});

await user.save();

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,

      user: {
        fullName,
        email,
      },
    });

  } catch (error) {

    console.log(
      "SIGNUP ERROR =>",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});

/*
==================================================
SIGNIN
==================================================
*/

app.post("/api/auth/signin", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

const user =
  await User.findOne({ email });
    if (!user) {

      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,

      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(
      "SIGNIN ERROR =>",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Signin failed",
    });
  }
});
/*
==================================================
GENERATE STUDY PLAN
==================================================
*/

app.post("/generate-plan", async (req, res) => {
  try {
    console.log("PLAN BODY =>", req.body);

    const subjects = req.body.subjects || [];

    if (subjects.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Subjects missing",
      });
    }

    

const prompt = `

You are an elite AI Study Coach.

Create a SMART DAILY EXAM PREPARATION PLAN.

==================================================
STUDENT EXAM DETAILS
==================================================

${subjects
  .map(
    (sub, index) => `

${index + 1})

Subject:
${sub.subject}

Exam Date:
${sub.examDate}

Difficulty:
${sub.difficulty}
`
  )
  .join("\n")}

==================================================
IMPORTANT INSTRUCTIONS
==================================================

1. DO NOT assume textbook chapters randomly

2. Create realistic student daily routines

3. Divide study into:
- Morning Session
- Afternoon Session
- Evening Session
- Night Revision

4. Include:
- concept learning
- theory study
- problem solving
- PYQ practice
- mock tests
- revision
- weak area improvement
- memory recall
- formula revision
- short notes preparation

5. Hard subjects should get more focus

6. Nearest exams should get higher priority

7. Keep schedule realistic and balanced

8. Add breaks and light revision naturally

9. Generate only between today's date and exam date

10. Use real chronological dates only

11. Output should feel like a premium AI productivity planner

12. Avoid random fake chapter names

13. NEVER mention specific chapter names or topic names unless user explicitly provides syllabus/topics
==================================================
DATE RULES
==================================================

Today's date:
${new Date().toISOString().split("T")[0]}

Never exceed exam dates.

==================================================
FORMAT
==================================================

Date: YYYY-MM-DD

Morning Session:
- Study core concepts from today's syllabus
- Make clean short notes
- Understand difficult areas carefully

Afternoon Session:
- Solve practice questions
- Work on problem-solving accuracy
- Revise previously studied portions

Evening Session:
- Practice PYQ questions
- Attempt important exam-oriented questions
- Improve speed and confidence

Night Revision:
- Quick revision of today's learning
- Formula and memory recall
- Prepare for next day study

--------------------------------

Generate full smart study planner now.

`;

    const completion =
      await client.chat.completions.create({
        model: "google/gemini-2.0-flash-001",

        messages: [
          {
            role: "system",
            content:
              "You are a professional AI study planner.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.5,

        max_tokens: 2500,
      });

    const plan =
      completion?.choices?.[0]?.message?.content;

    if (!plan) {
      throw new Error("AI plan response empty");
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.log("PLAN ERROR =>", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to generate plan",
    });
  }
});

/*
==================================================
GENERATE QUIZ
==================================================
*/

app.post(
  "/generate-quiz",
  upload.single("pdf"),

  async (req, res) => {
    try {
      console.log("REQ BODY =>", req.body);

      const {
        subject,
        educationLevel,

        schoolClass,
        syllabus,
        textbook,

        course,
        university,
        semester,
        referenceBook,

        studyScheme,
      } = req.body;

      /*
      ==========================================
      VALIDATION
      ==========================================
      */

      if (!subject || !educationLevel) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      /*
      ==========================================
      PDF EXTRACTION
      ==========================================
      */

      let extractedText = "";

      if (req.file) {
        try {
          console.log(
            "PDF RECEIVED =>",
            req.file.originalname
          );

          const dataBuffer =
            fs.readFileSync(req.file.path);

          const pdfData =
            await pdfParse(dataBuffer);

          extractedText = pdfData.text;

          if (
            !extractedText ||
            extractedText.trim() === ""
          ) {
            throw new Error(
              "No text extracted from PDF"
            );
          }

          extractedText = extractedText
            .replace(/\s+/g, " ")
            .substring(0, 45000);

          fs.unlinkSync(req.file.path);

          console.log(
            "PDF TEXT EXTRACTED SUCCESSFULLY"
          );
        } catch (pdfError) {
          console.log(
            "PDF ERROR =>",
            pdfError.message
          );
        }
      }

      /*
      ==========================================
      PROMPT
      ==========================================
      */

      let prompt = "";

      /*
      ==========================================
      SCHOOL QUIZ
      ==========================================
      */

      if (educationLevel === "School") {
        prompt = `

You are an expert school quiz generator.

Generate EXACTLY 10 MCQ questions.

==================================================
STUDENT DETAILS
==================================================

Subject:
${subject}

Class:
${schoolClass}

Syllabus:
${syllabus}

Study Scheme:
${studyScheme}

Textbook:
${textbook}

==================================================
IMPORTANT RULES
==================================================

1. Follow ONLY selected syllabus

2. Follow ONLY selected class

3. Use uploaded PDF as PRIMARY SOURCE

4. Questions MUST come from MULTIPLE chapters

5. NEVER generate questions from only 1 chapter

6. Cover:
- theory
- concepts
- important facts
- difficult areas

7. Questions must match textbook difficulty

8. Avoid unrelated CBSE/Core syllabus

9. Avoid internet random questions

10. If PDF exists:
Questions MUST come from PDF

11. EXACTLY 4 options

12. Include answer

13. EXACTLY 10 questions

14. Plain text only

15. Cover FULL syllabus evenly

==================================================
TEXTBOOK CONTENT
==================================================

${extractedText}

==================================================
FORMAT
==================================================

Question 1:
Question text

A) Option
B) Option
C) Option
D) Option

Answer: A

--------------------------------

Generate quiz now.

`;
      }

      /*
      ==========================================
      COLLEGE QUIZ
      ==========================================
      */

      else {
        prompt = `

You are an expert university quiz generator.

Generate EXACTLY 10 technical MCQ questions.

Subject:
${subject}

Course:
${course}

University:
${university}

Semester:
${semester}

Reference Book:
${referenceBook}

Study Scheme:
${studyScheme}

IMPORTANT RULES:

1. Use uploaded PDF as PRIMARY SOURCE

2. Questions from multiple modules

3. Technical questions only

4. Avoid repeated topics

5. EXACTLY 4 options

6. Include answer

7. EXACTLY 10 questions

8. Plain text only

PDF CONTENT:

${extractedText}

FORMAT:

Question 1:
Question text

A) Option
B) Option
C) Option
D) Option

Answer: A

--------------------------------

`;
      }

      /*
      ==========================================
      GEMINI REQUEST
      ==========================================
      */

      const completion =
        await client.chat.completions.create({
          model:
            "google/gemini-2.0-flash-001",

          messages: [
            {
              role: "system",
              content:
                "You are a professional educational AI quiz generator.",
            },

            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,

          max_tokens: 4000,
        });

      /*
      ==========================================
      RESPONSE
      ==========================================
      */

      const quiz =
        completion?.choices?.[0]?.message?.content;

      if (!quiz) {
        throw new Error("AI quiz response empty");
      }

      console.log(
        "QUIZ GENERATED SUCCESSFULLY"
      );

      res.json({
        success: true,
        quiz,
      });
    } catch (error) {
      console.log(
        "QUIZ ERROR =>",
        error.message
      );

      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
);

/*
==================================================
SERVER
==================================================
*/

/*
==================================================
MONGODB + SERVER START
==================================================
*/

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
})
  .then(() => {

    console.log("MongoDB Connected");

    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  })

  .catch((error) => {

    console.log(
      "MongoDB Error =>",
      error
    );

  });