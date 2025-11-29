// src/componentes/HomePony.js
import React, { useState, useEffect } from 'react';
// Importamos nuestro servicio de API del paso 1
import { getProductos } from './services/apiService.js'; 
// (Asumimos que la navegación y el header ya están o se agregarán)

const HomePony = () => {
  // Estado para guardar la lista de productos
  const [productos, setProductos] = useState([]);
  // Estado para manejar errores o carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await getProductos();
setProductos(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); 

  // --- Renderizado condicional ---
  if (loading) {
    return <div className="home-container"><p>Cargando productos...</p></div>;
  }

  if (error) {
    return <div className="home-container"><p>{error}</p></div>;
  }

  // --- Renderizado principal ---
  return (
    <div className="home-container">
    
      
      <div className="content">
        <h1 className="main-title">Nuestros Productos</h1>
        
       
        <div className="product-grid">
          
          {productos.map(producto => (
           
            <div key={producto.id} className="product-card">
              <img src={producto.imagenUrl} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="price">${producto.precio}</p>
              
             
              <button onClick={() => alert(`Agregado: ${producto.nombre}`)}>
                Agregar al carrito
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default HomePony;