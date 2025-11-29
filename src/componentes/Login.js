// src/componentes/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from './services/apiService.js'; 

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await loginUsuario({ usuario, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.rol);
      alert('¡Bienvenido!');
     
      if (response.data.rol === 'admin') {
        navigate('/ponystore'); // Ruta de admin
      } else {
        navigate('/Catalogo'); // Ruta de cliente/tienda
      }

    } catch (err) {
      console.error('Error en el login:', err);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  return (

    
    <div className="auth-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h1>Iniciar Sesión</h1>
          <div className="input-group">
           
<input 
  type="text" 
  placeholder="Usuario"
  value={usuario} 
  onChange={(e) => setUsuario(e.target.value)} 
  required
/>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit">Entrar</button>
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>

  );

};

export default Login;