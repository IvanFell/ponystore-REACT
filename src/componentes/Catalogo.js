// src/componentes/Catalogo.js (Corregido)
import React, { useState, useEffect } from 'react';
import Producto from './Producto';

import { getProductos } from './services/apiService';

function Catalogo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        
        const response = await getProductos(); 
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="catalogo-container">
      <h2>Catálogo de Productos</h2>
      <div className="productos-grid">
        {productos.map((producto) => (
          <Producto key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default Catalogo;