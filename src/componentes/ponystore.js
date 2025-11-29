// src/componentes/ponystore.js
import React, { useState, useEffect } from 'react';
import { getUsuarios, crearUsuarioAdmin, eliminarUsuario, actualizarUsuario } from './services/apiService';
import { Link } from 'react-router-dom';

const PonyStore = () => {
  const [usuarios, setUsuarios] = useState([]);
  
  const [nombre, setNombre] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios. ¿Tu API está encendida?');
    }
  };

  const limpiarFormulario = () => {
    setNombre(''); 
    setEmail('');
    setPassword('');
    setRol('cliente');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    const datosUsuario = { nombre, email, rol };
    if (password || !editingId) { 
      datosUsuario.password = password;
    }

    try {
      if (editingId) {
        await actualizarUsuario(editingId, datosUsuario);
        alert('Usuario actualizado con éxito');
      } else {
        if (!password) {
          alert('La contraseña es obligatoria al crear un usuario');
          return;
        }
        await crearUsuarioAdmin(datosUsuario);
        alert('Usuario creado con éxito');
      }
      
      limpiarFormulario();
      cargarUsuarios(); 

    } catch (error) {
        console.error('Error al guardar usuario:', error);
        let mensajeError = 'Error al guardar usuario.';
       
        if (error.response && (error.response.data.message || error.response.data.error)) {
            mensajeError = error.response.data.message || error.response.data.error;
        }
        alert(mensajeError);
    }
  };

  const handleEditar = (user) => {
    
    setEditingId(user.id); 
    setNombre(user.usuario); 
    setEmail(user.email || ''); 
    setRol(user.rol);
    setPassword('');
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await eliminarUsuario(id);
        alert('Usuario eliminado');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };


  return (
    <div className="container">
      <h1>Panel de Administración de Usuarios</h1>
      
      <Link to="/">Ir a la Tienda (Home) &rarr;</Link>

      <form onSubmit={handleSubmit} className="add-form">
        <h3>{editingId ? 'Modificar Usuario' : 'Agregar Nuevo Usuario'}</h3>
        <input 
          type="text" 
          placeholder="Nombre de Usuario" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email (opcional, no se guarda)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
        
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
        {editingId && (
          <button type="button" onClick={limpiarFormulario} className="button-cancel">
            Cancelar Edición
          </button>
        )}
      </form>

      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th> 
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
         
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.usuario}</td> 
              <td>{user.rol}</td>
              <td>
                <button onClick={() => handleEditar(user)} className="button-update">
                  Editar
                </button>
                <button onClick={() => handleEliminar(user.id)} className="button-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <video width="500" autoPlay muted loop>
        <source src="https://videos.pexels.com/video-files/5495204/5495204-hd_1280_720_30fps.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>
  );
};

export default PonyStore;