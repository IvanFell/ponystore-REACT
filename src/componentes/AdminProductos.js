// src/componentes/AdminProductos.js
import React, { useState } from 'react';
import { crearProducto } from './services/apiService';
import { Link } from 'react-router-dom';
import '../style.css'; // Reusamos tus estilos

const AdminProductos = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearProducto(producto);
      alert('¡Producto agregado con éxito!');
      setProducto({ nombre: '', descripcion: '', precio: '', imagen: '' }); // Limpiar form
    } catch (error) {
      console.error(error);
      alert('Error al agregar el producto');
    }
  };

  return (
    <div className="auth-container">
      <div className="login-box" style={{ maxWidth: '500px' }}> {/* Un poco más ancho */}
        <form onSubmit={handleSubmit}>
          <h1>Agregar Producto Nuevo</h1>
          
          <div className="input-group">
            <input 
              name="nombre" 
              placeholder="Nombre del Producto" 
              value={producto.nombre} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="descripcion" 
              placeholder="Descripción corta" 
              value={producto.descripcion} 
              onChange={handleChange} 
            />
            <input 
              name="precio" 
              type="number" 
              placeholder="Precio ($)" 
              value={producto.precio} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="imagen" 
              placeholder="URL de la imagen (ej: https://...)" 
              value={producto.imagen} 
              onChange={handleChange} 
            />
          </div>

          <button type="submit">Guardar Producto</button>
          
          <p style={{ marginTop: '15px' }}>
            <Link to="/catalogo">← Ver Catálogo</Link> | <Link to="/ponystore">Admin Usuarios</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminProductos;