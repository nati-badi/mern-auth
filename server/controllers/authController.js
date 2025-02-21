import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send a welcome email to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Badi app!",
      text: `Hello ${name}, Your account has been created successfully with an email ${email}.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logout a user
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    if (req.session) {
      req.session.destroy();
    }

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send a verification email to the user
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      // text: `Hello ${user.name}, please verify your email by entering the OTP ${otp} within 24 hours. If you did not request this, please ignore this email. Thank you!`,
      html: `<p>Hello ${user.name},</p>
        <p>Please verify your email by entering the OTP <b>${otp}</b> within <b>24 hours</b>. If you did not request this, please ignore this email. Thank you!</p>
        <p>Best regards,</p>
        <p>Badi App</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Verify the user's email using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = "";

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Send OTP to reset password
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset your password",
      // text: `Hello ${user.name}, please reset your password by entering the OTP ${otp} within 15 minutes. If you did not request this, please ignore this email. Thank you!`,
      html: `<p>Hello ${user.name},</p>
        <p>Please reset your password by entering the OTP <b>${otp}</b> within <b>15 minutes</b>. If you did not request this, please ignore this email. Thank you!</p>
        <p>Best regards,</p>
        <p>Badi App</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide OTP, email and new password" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiry = "";

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
