import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "", { path: '/' });
    window.localStorage.removeItem("userID");
    navigate("/auth");
  }

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">RecipeTrack</Link>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/createRecipe">Create Recipe</Link>
        <Link to="/savedRecipe">Saved Recipes</Link>
        {!cookies['access_token'] ?
          (<Link to="/auth">Login/Register</Link>) :
          (<button onClick={logout}>Logout</button>)
        }
      </div>
    </div>
  )
}

export default NavBar;
