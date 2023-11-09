
import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/home"
import { Auth } from "./pages/Auth/auth"
import { CreateRecipe } from "./pages/Create_Recipe/createRecipe"
import { SavedRecipe } from "./pages/savedRecipe"
import { NavBar } from "./components/NavBar"
import { RecipeDetails } from "./pages/Recipe_Details/recipeDetails"

function App() {

  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/createRecipe" element={<CreateRecipe />} />
          <Route path="/savedRecipe" element={<SavedRecipe/>} />
          <Route path="/recipeDetails/:recipeId" element={<RecipeDetails />} />
        </Routes>
        </Router>
      </div>
  );
}

export default App;
