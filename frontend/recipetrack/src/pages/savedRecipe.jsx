// SavedRecipe.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import "./Home/Home.css";

export const SavedRecipe = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();
  const navigate = useNavigate();

  // Redirect to the recipeDetails page with the recipeID
  const redirectToRecipeDetails = (recipeId) => {
    navigate(`/recipeDetails/${recipeId}`);
  };

  // Redirect to the edit page with the recipeID
  const redirectToEditRecipe = (recipeID) => {
    navigate(`/editRecipe/${recipeID}`);
  };

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const unsaveRecipe = async (recipeID) => {
    const confirmUnsave = window.confirm("Are you sure you want to unsave this recipe?");
    if (confirmUnsave) {
      try {
        window.alert("Recipe unsaved successfully!"); // Display alert before unsave
        await axios.put("http://localhost:3001/recipes/unsave", {
          recipeID,
          userID,
        });
        const updatedSavedRecipes = savedRecipes.filter((recipe) => recipe._id !== recipeID);
        console.log("Updated Saved Recipes:", updatedSavedRecipes);
        setSavedRecipes(updatedSavedRecipes);
      } catch (err) {
        console.log("Unsave Error:", err);
      }
    }
  };
  
  

  return (
    <div className="home-container">
      <h1>Saved Recipes</h1>
      <ul className="recipe-grid">
        {savedRecipes.map((recipe, index) => (
          <li
            key={recipe._id}
            className={`recipe-card ${
              index % 3 === 0 ? "first-in-row" : ""
            }`}
          >
            <div className="recipe-details">
              <div className="name-and-save">
                <h2 className="recipe-title">{recipe.name}</h2>
                <button
                  className="recipe-save-button"
                  onClick={() => unsaveRecipe(recipe._id)} // Change the function to unsaveRecipe
                >
                  Unsave
                </button>
              </div>
              <img
                className="recipe-image"
                src={recipe.imageUrl}
                alt={recipe.name}
              />
              <div className="ingredients">
                <p>Ingredients: {recipe.ingredients.join(", ")}</p>
              </div>
              <div className="description">
                <p>{recipe.instructions}</p>
              </div>
              <p className="recipe-time">Cooking Time: {recipe.cookingTime} minutes</p>
              <div className="buttons">
                <button onClick={() => redirectToEditRecipe(recipe._id)}>Edit</button>
              </div>
              <div className="buttons">
                <button onClick={() => redirectToRecipeDetails(recipe._id)}>Recipe Details</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipe;
