import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PonyStore = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUser] = useState(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  

  // Estados para el formulario de agregar
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  // Estados para la edición en línea
  const [editingId, setEditingId] = useState(null);
  const [editingUsuario, setEditingUsuario] = useState('');
  const [editingContrasena, setEditingContrasena] = useState('');

  // Cargar usuarios al iniciar
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchUsuarios();
    }
  }, [currentUser, navigate]);

  const fetchUsuarios = async () => {
    const response = await axios.get('http://localhost:3001/api/users');
    setUsuarios(response.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/users', { 
        nuevo_usuario: nuevoUsuario, 
        nueva_contrasena: nuevaContrasena 
    });
    setNuevoUsuario('');
    setNuevaContrasena('');
    fetchUsuarios();
  };
  
  const handleUpdateUser = async (id) => {
    await axios.put(`http://localhost:3001/api/users/${id}`, {
        nuevo_usuario: editingUsuario,
        nueva_contrasena: editingContrasena
    });
    setEditingId(null);
    fetchUsuarios();
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
        await axios.delete(`http://localhost:3001/api/users/${id}`);
        fetchUsuarios();
    }
  };
  
  const startEditing = (user) => {
      setEditingId(user.id);
      setEditingUsuario(user.usuario);
      setEditingContrasena('');
  }

  return (
    <div className="container">
      <h1>Administración de Usuarios</h1>
      <p>Sesión actual: {currentUser} | <button onClick={handleLogout} className="link-button">Cerrar Sesión</button></p>

      <h2>Agregar Nuevo Usuario</h2>
      <form onSubmit={handleAddUser} className="add-form">
        <input type="text" value={nuevoUsuario} onChange={(e) => setNuevoUsuario(e.target.value)} placeholder="Nombre de Usuario" required />
        <input type="password" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Agregar Usuario</button>
      </form>

      <hr />

      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input type="text" value={editingUsuario} onChange={(e) => setEditingUsuario(e.target.value)} />
                ) : (
                  user.usuario
                )}
                 {editingId === user.id && (
                  <input type="password" value={editingContrasena} onChange={(e) => setEditingContrasena(e.target.value)} placeholder="Nueva Contraseña" />
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <>
                    <button onClick={() => handleUpdateUser(user.id)} className="button-update">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="button-cancel">Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(user)} className="button-update">Editar</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="button-delete">Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <video width="400" height="400" controls><source src="video divertido.mp4" type="video/mp4" /> </video>
    </div>
  );
};

export default PonyStore;