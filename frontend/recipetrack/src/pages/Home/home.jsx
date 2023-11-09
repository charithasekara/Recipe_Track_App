// Home.jsx
import React, { useEffect, useState } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";
import "./Home.css";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const userRecipes = recipes.filter((recipe) => recipe.userOwner === userID);

  return (
    <div className="home-container">
      <h1>Your Recipes</h1>
      <ul className="recipe-grid">
        {userRecipes.map((recipe, index) => (
          <li
            key={recipe._id}
            className={`recipe-card ${
              index % 3 === 0 ? "first-in-row" : ""
            }`}
          >
            <div>
              <h2 className="recipe-title">{recipe.name}</h2>
              <button
                className={`recipe-save-button ${
                  isRecipeSaved(recipe._id) ? "recipe-saved" : ""
                }`}
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img
              className="recipe-image"
              src={recipe.imageUrl}
              alt={recipe.name}
            />
            <p className="recipe-time">
              Cooking Time: {recipe.cookingTime} minutes
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
