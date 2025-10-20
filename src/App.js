import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


import Login from './componentes/Login';
import Registro from './componentes/Registro';
import PonyStore from './componentes/ponystore';

// Importa el CSS principal desde la carpeta src
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/ponystore" element={<PonyStore />} />
        {/* Redirige a /login si no se especifica otra ruta */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;