import User from "../models/authModel.js";
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error sending message", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};
