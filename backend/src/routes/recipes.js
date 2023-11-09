import express from 'express';
import { RecipesModel } from '../models/Recipes.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../models/Users.js';
import bcrypt from 'bcrypt'; // Import the bcrypt library for password hashing

const recipesRouter = express.Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.headers['x-access-token'] || req.headers['token'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.decoded = decoded;
    next();
  });
};

recipesRouter.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

recipesRouter.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'User does not exist!' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid Credentials!' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );
    res.json({ token, userID: user._id });
  } catch (error) {
    res.status(500).json(error);
  }
});

recipesRouter.get('/recipes', async (req, res) => {
  try {
    const recipes = await RecipesModel.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

recipesRouter.post('/api/recipes', verifyToken, async (req, res) => {
  const { name, image, ingredients, instructions, imageUrl, cookingTime } = req.body;
  const userOwner = req.decoded.id;

  try {
    const recipe = new RecipesModel({
      name,
      image,
      ingredients,
      instructions,
      imageUrl,
      cookingTime,
      userOwner,
    });

    const result = await recipe.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

export   { recipesRouter };
