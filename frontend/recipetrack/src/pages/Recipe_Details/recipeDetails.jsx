// RecipeDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./RecipeDetails.css"; // Import the CSS file

export const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/${recipeId}`);
        console.log(response.data);
        setRecipeDetails(response.data);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="image-container">
        <img className="recipe-detail-image" src={recipeDetails.imageUrl} alt={recipeDetails.name} />
      </div>
      <div className="details-container">
        <h1>{recipeDetails.name}</h1>
        <p>Ingredients: {recipeDetails.ingredients.join(", ")}</p>
        <p>Description: {recipeDetails.instructions}</p>
        <p>Cooking Time: {recipeDetails.cookingTime} minutes</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
