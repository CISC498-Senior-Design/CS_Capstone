import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import crypto from "crypto";

import session from "express-session";
import { authRouter } from "./auth.js";
import { notesRouter } from "./notes.js";

const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI", "SESSION_SECRET"];

//quick check to see if the env files are actually in
for (const name of required) {
  console.log(name, process.env[name] ? "✓ set" : "✗ MISSING");
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.set("trust proxy", 1); // needed for cloud run for secure cookies

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use(authRouter);
app.use(notesRouter);


app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Persistent Note Taking API is running",
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);       // ".png"
    cb(null, crypto.randomUUID() + ext);               // "a1b2c3....png"
  },
});

const upload = multer({
  storage,                        // saved to ./uploads with a random name
  limits: { fileSize: 50 * 1024 * 1024 },  // 50 MB max
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith("audio/"));
  },
});

app.post("/api/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No audio file received" });
    return;
  }

  res.json({
    message: "Uploaded!",
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});


//TODO:
//Needs production database for the session store