// ponystore-api/server.js
require('dotenv').config(); // Cargar variables de entorno para local
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
// Configuración del puerto (Render usa process.env.PORT)
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Importante para que Vercel se pueda conectar
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la Base de Datos (Híbrida: Nube o Local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/ponystore',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // SSL requerido en Render
});

// --- RUTAS DE LA API ---

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de PonyStore funcionando correctamente 🚀');
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.contrasena))) {
      res.json({ message: 'Login correcto', usuario: user.usuario, rol: user.rol, id: user.id });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' }); 
    }
  } catch (error) {
    console.error('Error en /api/login:', error);
    res.status(500).json({ message: 'Error en el servidor' }); 
  }
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, password } = req.body;
  
  if (!nombre || !password) {
    return res.status(400).json({ message: 'Nombre y contraseña requeridos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const rol = (nombre === 'admin') ? 'admin' : 'cliente';

  try {
    const result = await pool.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES ($1, $2, $3) RETURNING id',
      [nombre, hashedPassword, rol]
    );
    res.status(201).json({ id: result.rows[0].id, usuario: nombre });
  } catch (error) {
    console.error('Error en /api/register:', error);
    if (error.code === '23505') { 
        return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }
    res.status(500).json({ message: 'Error al registrar' }); 
  }
});

// Obtener usuarios (Para el panel de admin)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, usuario, rol FROM usuarios ORDER BY id'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/users:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' }); 
  }
});

// Crear usuario desde panel admin
app.post('/api/users', async (req, res) => {
    const { nombre, password, rol } = req.body;
    
    if (!nombre || !password || !rol) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (usuario, contrasena, rol) VALUES ($1, $2, $3) RETURNING id, usuario',
            [nombre, hashedPassword, rol] 
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en POST /api/users:', error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }
        res.status(500).json({ message: 'Error al crear usuario' }); 
    }
});

// --- TU CÓDIGO ADAPTADO AQUÍ ---

// Actualizar un usuario (Admin)
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, password, rol } = req.body; 

  try {
    let query;
    let params;

    if (password) { 
      // Si enviaron contraseña nueva, la encriptamos y actualizamos todo
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE usuarios SET usuario = $1, contrasena = $2, rol = $3 WHERE id = $4';
      params = [nombre, hashedPassword, rol, id];
    } else { 
      // Si NO enviaron contraseña, solo actualizamos nombre y rol
      query = 'UPDATE usuarios SET usuario = $1, rol = $2 WHERE id = $3';
      params = [nombre, rol, id];
    }

    const result = await pool.query(query, params);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error en PUT /api/users/:id:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }
    res.status(500).json({ message: 'Error al actualizar el usuario' }); 
  }
});

// Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /api/users/:id:', error);
    // Verificamos si es error de llave foránea (integridad referencial)
    if (error.code === '23503') {
        return res.status(400).json({ message: 'No se puede eliminar: El usuario tiene datos relacionados.' });
    }
    res.status(500).json({ message: 'Error al eliminar el usuario' }); 
  }
});

// Obtener productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' }); 
  }
});

app.listen(port, () => {
  console.log(`Servidor de API corriendo en el puerto ${port}`);
});



// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO producto (nombre, descripcion, precio, imagen) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, imagen]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error en el servidor al guardar producto' });
  }
});