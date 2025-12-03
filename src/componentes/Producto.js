// src/componentes/Producto.js
import React from 'react';
import '../style.css'; 

// CAMBIO AQUÍ: Recibimos "producto" en lugar de las variables sueltas
function Producto({ producto }) {
  
  // Extraemos los datos del objeto producto
  // Asegúrate de que tu base de datos tenga estos nombres de columna exactos
  const { nombre, precio, descripcion, imagen } = producto;

  const handleAgregar = () => {
    alert(`Agregaste "${nombre}" al carrito.`);
  };

  return (
    <div className="product-card">
      {/* Si la imagen no carga, mostramos un texto alternativo o una imagen por defecto */}
      <img 
        src={imagen || 'https://via.placeholder.com/150'} 
        alt={nombre} 
        className="product-image" 
        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Fallback si la imagen está rota
      />
      <div className="product-info">
        <h3 className="product-title">{nombre}</h3>
        <p className="product-price">${precio}</p>
        <p className="product-description">{descripcion}</p>
      </div>
      <button className="product-button" onClick={handleAgregar}>
        Agregar al carrito
      </button>
    </div>
  );
}

export default Producto;