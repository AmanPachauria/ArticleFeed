import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
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
    // res.status(500).json(error.message);
    next(error);
  }
};


export const signin = async ( req, res, next) => {
    const { emailOrPhoneNumber, password } = req.body;
    try {
        const validUser = await User.findOne({
            $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }],
        });

        if( !validUser ) return next(errorHandler(404, 'User not found With This Number of email'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if( !validPassword ) return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign({id: validUser._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, {httpOnly: true})
           .status(200)
           .json(rest);
    } catch (error) {
        next(error);
    }
}