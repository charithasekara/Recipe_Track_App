import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { recipesRouter } from './routes/recipes.js';// Import the correct routes
import { userRouter } from './routes/users.js'; // Import the correct routes

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter); // Pass the app instance to userRouter
app.use("/api", recipesRouter); // Pass the app instance to recipesRouter

mongoose.connect("mongodb+srv://charithmadhushansekara:Mernrecipe@recipetrack.hdwyxj3.mongodb.net/recipetrack?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(3001, () => {
    console.log('Server started on port 3001');
  });
});
