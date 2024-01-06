import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const {
    userFirstName,
    userLastName,
    phoneNumber,
    email,
    dateOfBirth,
    password,
    preferences,
  } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    userFirstName,
    userLastName,
    phoneNumber,
    email,
    dateOfBirth,
    password: hashedPassword,
    preferences,
  });

  try {
       await newUser.save();
       res.status(201).json("User created successfully!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
