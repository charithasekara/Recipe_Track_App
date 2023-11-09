import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";
import mongoose from "mongoose";

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.headers['x-access-token'] || req.headers['token'];
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token.' });
      }
      req.decoded = decoded;
      next();
    });
  }
  

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );
    res.json({ token, userID: user._id });
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as userRouter, verifyToken };
