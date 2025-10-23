// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Importaciones existentes
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import PonyStore from './componentes/ponystore';

// --- PASO 1: IMPORTA EL COMPONENTE CON SU NUEVO NOMBRE ---
import HomePony from './componentes/HomePony'; // <- Cambio aquí

import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PASO 2: USA EL COMPONENTE CON SU NUEVO NOMBRE EN LA RUTA --- */}
        <Route path="/home" element={<HomePony />} /> {/* <- Cambio aquí */}
        
        {/* Rutas existentes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/ponystore" element={<PonyStore />} />
        
        <Route path="/" element={<Navigate to="/home" />} /> 
      </Routes>
    </Router>
  );
}

export default App;