import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, isAccountVerified } = user;

    return res.status(200).json({ name, email, isAccountVerified });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
