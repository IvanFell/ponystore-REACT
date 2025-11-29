// src/componentes/Navegacion.js
import React from 'react';
import { Link } from 'react-router-dom';


import '../style.css'; 

function Navegacion() {
  return (
    <nav className="navbar"> 
      <div className="navbar-logo">
        <Link to="/">PonyStore</Link> 
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/catalogo">Catálogo</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/registro">Registro</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navegacion;