import generateTokenAndSetCookie from "../utlis/generateToken.js";
import User from "../models/authModel.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ status: 400, messgae: "User already exists" });
    }

    //hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profile: gender === "male" ? boyProfile : girlProfile,
    });

    if (newUser) {
      //Generate JWT token here
      await generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        status: 201,
        message: "User successfully created",
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        profile: user.profile,
      });
    } else {
      res.status(400).json({ status: 400, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup", error.message);
    res.status(500).json({ status: 500, messgae: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid Username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid Username or password" });
    }

    await generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      status: 200,
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profile: user.profile,
    });
  } catch (error) {
    console.error("Error in login", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error in login", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};
