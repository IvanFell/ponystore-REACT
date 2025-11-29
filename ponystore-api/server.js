const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001; // Puerto para el backend

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ponystore',
  password: '1234',
  port: 5432,
});

// --- RUTAS DE LA API ---

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ message: 'Nombre y contraseña son requeridos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Si el usuario se llama 'admin', asígnale el rol 'admin', si no, 'cliente'.
  const rol = (nombre === 'admin') ? 'admin' : 'cliente';

  try {
    const result = await pool.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES ($1, $2, $3) RETURNING id',
      [nombre, hashedPassword, rol] // Usamos la variable 'rol'
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

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, usuario, rol FROM usuarios ORDER BY id'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/users (GET):', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' }); 
  }
});


// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/productos:', error); 
    res.status(500).json({ message: 'Error al obtener los productos' }); 
  }
});


// Agregar un nuevo usuario (Admin)
app.post('/api/users', async (req, res) => {
    const { nombre, password, rol } = req.body; 
    
    if (!nombre || !password || !rol) {
        return res.status(400).json({ message: 'Nombre, password y rol son requeridos' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (usuario, contrasena, rol) VALUES ($1, $2, $3) RETURNING id, usuario',
            [nombre, hashedPassword, rol] 
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en /api/users (POST):', error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }
        res.status(500).json({ message: 'Error al agregar el usuario' }); 
    }
});


// Actualizar un usuario (Admin)
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, password, rol } = req.body; 

  try {
    let query;
    let params;

    if (password) { 
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE usuarios SET usuario = $1, contrasena = $2, rol = $3 WHERE id = $4';
      params = [nombre, hashedPassword, rol, id];
    } else { 
      query = 'UPDATE usuarios SET usuario = $1, rol = $2 WHERE id = $3';
      params = [nombre, rol, id];
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error en /api/users/:id (PUT):', error);
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
    console.error('Error en /api/users/:id (DELETE):', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' }); 
  }
});

app.listen(port, () => {
  console.log(`Servidor de API corriendo en http://localhost:${port}`);
});