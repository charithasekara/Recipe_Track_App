// EditRecipe.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../Create_Recipe/CreateRecipe.css"; // Reusing the same styling as CreateRecipe

export const EditRecipe = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: ["", "", "", ""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
  });

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/recipes/${recipeId}`,
        { ...recipe },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Recipe Updated");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="create-recipe">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <div className="ingredients-group">
            {recipe.ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
              />
            ))}
          </div>
          <button type="button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecipe;
