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
        alert('✅ Usuario actualizado con éxito');
      } else {
        if (!password) {
          alert('⚠️ La contraseña es obligatoria');
          return;
        }
        await crearUsuarioAdmin(datosUsuario);
        alert('✅ Usuario creado con éxito');
      }
      
      limpiarFormulario();
      cargarUsuarios(); 

    } catch (error) {
        console.error('Error detallado:', error);
        // Capturamos el mensaje exacto que envía el servidor (ej: "Usuario ya existe")
        const mensaje = error.response?.data?.message || 'Error desconocido al guardar.';
        alert(`❌ Error: ${mensaje}`);
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
    if (window.confirm('¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await eliminarUsuario(id);
        alert('🗑️ Usuario eliminado correctamente');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar:', error);
        const mensaje = error.response?.data?.message || 'No se pudo eliminar el usuario.';
        alert(`❌ Error: ${mensaje}`);
      }
    }
  };

  return (
    <div className="container">
      <h1>Panel de Administración de Usuarios</h1>
      
      <Link to="/" className="back-link">← Volver al Inicio</Link>

      <form onSubmit={handleSubmit} className="add-form">
        <h3>{editingId ? '✏️ Modificar Usuario' : '➕ Agregar Nuevo Usuario'}</h3>
        <input 
          type="text" 
          placeholder="Nombre de Usuario" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        {/* El email es visual, el backend no lo guarda por ahora */}
        <input 
          type="email" 
          placeholder="Email (opcional)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder={editingId ? 'Nueva contraseña (dejar vacía para mantener)' : 'Contraseña'}
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
        
        <div className="form-actions">
            <button type="submit" className="button-save">
                {editingId ? 'Actualizar' : 'Guardar Usuario'}
            </button>
            {editingId && (
            <button type="button" onClick={limpiarFormulario} className="button-cancel">
                Cancelar
            </button>
            )}
        </div>
      </form>

      <h2>Lista de Usuarios Registrados</h2>
      <div className="table-responsive">
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
                <td>
                    <span className={`badge ${user.rol === 'admin' ? 'badge-admin' : 'badge-client'}`}>
                        {user.rol}
                    </span>
                </td>
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
      </div>
    </div>
  );
};

export default PonyStore;