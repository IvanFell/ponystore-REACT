// src/componentes/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, { usuario, contrasena });
      if (response.data) {
        localStorage.setItem('usuario', usuario);
        navigate('/ponystore');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Por favor, intente nuevamente.';
      alert(errorMessage);
    }
  };


  return (
   
    <div className="auth-container"> 
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
              required
            />
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </div>
    </div> 
  );
};

export default Login;