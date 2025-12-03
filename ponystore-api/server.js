// ponystore-api/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
// Render asigna un puerto automáticamente en la variable PORT
const port = process.env.PORT || 3001; 

// Middleware
app.use(cors()); // Permite conexiones desde Vercel
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la Base de Datos (Crucial para Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/ponystore',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // SSL es obligatorio en Render
});

// --- RUTAS DE LA API ---

// Ruta de prueba para ver si el servidor vive
app.get('/', (req, res) => {
  res.send('¡El Backend de PonyStore está funcionando!');
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ message: 'Nombre y contraseña son requeridos' });
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
    res.status(500).json({ message: 'Error al registrar el usuario' }); 
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.contrasena))) {
      res.json({ message: 'Login correcto', usuario: user.usuario, rol: user.rol });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' }); 
    }
  } catch (error) {
    console.error('Error en /api/login:', error);
    res.status(500).json({ message: 'Error en el servidor' }); 
  }
});

// Obtener usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, usuario, rol FROM usuarios ORDER BY id'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' }); 
  }
});

// Obtener productos
app.get('/api/productos', async (req, res) => {
  try {
   
    const result = await pool.query('SELECT * FROM producto ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener los productos' }); 
  }
});

// (Mantén el resto de tus rutas PUT/DELETE aquí...)

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});