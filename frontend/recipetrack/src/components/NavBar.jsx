// NavBar.jsx
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
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const renderAuthButtons = () => {
    if (!cookies['access_token']) {
      return <button><Link to="/auth">Login/Register</Link></button>;
    } else {
      return <button onClick={logout}>Logout</button>;
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">Recipe Tracker</Link>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/createRecipe">Create Recipe</Link>
        <Link to="/savedRecipe">Saved Recipes</Link>
        <button onClick={refreshPage}>Refresh</button>
        {renderAuthButtons()}
      </div>
    </div>
  );
}

export default NavBar;
