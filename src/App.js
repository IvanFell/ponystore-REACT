// src/App.js (Corregido para ocultar Nav)
import React from 'react';
// 1. Importa useLocation junto a Route y Routes
import { Route, Routes, useLocation } from 'react-router-dom';

// Componentes existentes
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import HomePony from './componentes/HomePony'; 
import PonyStore from './componentes/ponystore';

// Componentes nuevos

import Catalogo from './componentes/Catalogo'; 

// CSS
import './style.css';

function App() {
  
  
  const location = useLocation();
  
  const currentPath = location.pathname;

  return (
    <div> 
      
      
      <Routes>
        <Route path="/" element={<Registro/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/ponystore" element={<PonyStore />} />
      </Routes>
    </div>
  );
}

export default App;