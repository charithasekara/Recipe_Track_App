import React, { useEffect, useState } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
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
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
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
      console.error(err);
    }
  };

  const deleteRecipe = async (recipeID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (confirmDelete) {
      try {
        window.alert("Recipe deleted successfully!"); // Display alert before deletion
        await axios.delete(`http://localhost:3001/recipes/${recipeID}`);
        window.location.reload(); // Refresh the page
      } catch (err) {
        console.error(err);
      }
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
            <div className="recipe-details">
              <div className="name-and-save">
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
              <p className="recipe-time">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
              <div className="buttons">
                <button className="delete-button" onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                <button className="edit-button" onClick={() => redirectToEditRecipe(recipe._id)}>Edit</button>
              </div>
              <div className="buttons">
                <button className="recipe-details-button" onClick={() => redirectToRecipeDetails(recipe._id)}>Recipe Details</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
