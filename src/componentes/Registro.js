// src/componentes/Registro.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from './services/apiService.js';

const Registro = () => {
  
  const [nombre, setNombre] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await registrarUsuario({ nombre, password }); 
      console.log(response.data);
      navigate('/login'); // Redirige al login
    } catch (error) {
      console.error('Error detallado en el registro:', error);

      let mensajeError = 'Error en el registro. Inténtalo de nuevo.';

      if (error.response) {
        
        mensajeError = error.response.data.message || error.response.data.error || 'Error del servidor.';
      
      } else if (error.request) {
        mensajeError = 'No se pudo conectar con el servidor. ¿Está encendido?';
      
      } else {
        mensajeError = error.message;
      }
      
      alert(mensajeError);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h1>Registrarse</h1>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nombre de Usuario" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
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
          <button type="submit">Crear Cuenta</button>
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registro;