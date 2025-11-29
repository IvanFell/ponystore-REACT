// src/componentes/Producto.js
import React from 'react';
import '../style.css'; // Importamos el CSS 


function Producto({ nombre, precio, descripcion, imagen }) {

  
  const handleAgregar = () => {
   
    alert(`Agregaste "${nombre}" al carrito.`);
  };

  return (
    <div className="product-card">
      <img src={imagen} alt={nombre} className="product-image" />
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