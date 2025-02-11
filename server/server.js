import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API routes/endpoints
app.get("/", (req, res) => {
  res.send("Api is running!");
});
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
