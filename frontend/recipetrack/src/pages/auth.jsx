import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export function Auth() {
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const isAuthenticated = cookies['access_token'];

  const logout = () => {
    setCookie('access_token', '', { path: '/' });
    window.localStorage.removeItem('userID');
    navigate('/auth');
  };

  return (
    <div className="auth">
      <Login setCookie={setCookie} navigate={navigate} />
      <Register />
    </div>
  );
}

const Login = ({ setCookie, navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      if (response.data.token) {
        alert('Login Success');
        setCookie('access_token', response.data.token, { path: '/' });
        window.localStorage.setItem('userID', response.data.userID);
        setUsername('');
        setPassword('');
        navigate('/');
      } else {
        alert('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
}

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/register', {
        username,
        password,
      });
      alert('Registration Completed! Now Login');
      setUsername('');
      setPassword('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit={onSubmit}
    />
  );
}

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className="authContainer">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">{label}</button>
      </form>
    </div>
  );
};

export default Auth;
