import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

// MongoDB connection configuration
const dbURI = 'mongodb+srv://charithmadhushansekara:Mernrecipe@recipetrack.hdwyxj3.mongodb.net/recipetrack?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(3001, () => console.log('Server started'));
