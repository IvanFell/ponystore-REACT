// src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
 
  baseURL: 'https://ponystore-react.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Productos ---
export const getProductos = () => {
  
  return apiClient.get('/productos'); 
};
export const getServicios = () => {
  return apiClient.get('/servicios');
};


// --- Autenticación y Usuarios ---

export const loginUsuario = (credenciales) => {
  return apiClient.post('/login', credenciales);
};
export const registrarUsuario = (datosUsuario) => {
  return apiClient.post('/register', datosUsuario);
};


export const getUsuarios = () => {
  return apiClient.get('/users');
};
export const crearUsuarioAdmin = (datosUsuario) => {
  return apiClient.post('/users', datosUsuario);
};
export const actualizarUsuario = (id, datosUsuario) => {
  return apiClient.put(`/users/${id}`, datosUsuario);
};
export const eliminarUsuario = (id) => {
  return apiClient.delete(`/users/${id}`);
};