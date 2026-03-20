const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.nombre, u.gmail, u.bio, u.created_at, r.nombre as role
            FROM usuarios u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get usuarios error:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, gmail, password, bio, role } = req.body;

        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE gmail = $1',
            [gmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const roleId = role === 'admin' ? 1 : 2;

        const result = await pool.query(`
            INSERT INTO usuarios (nombre, gmail, password_hash, bio, role_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nombre, gmail, bio, role_id
        `, [nombre, gmail, passwordHash, bio || null, roleId]);

        const user = result.rows[0];
        res.status(201).json({
            ...user,
            role: user.role_id === 1 ? 'admin' : 'user'
        });
    } catch (error) {
        console.error('Create usuario error:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, bio, role } = req.body;

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramIndex}`);
            values.push(nombre);
            paramIndex++;
        }
        if (bio !== undefined) {
            updates.push(`bio = $${paramIndex}`);
            values.push(bio);
            paramIndex++;
        }
        if (role !== undefined) {
            updates.push(`role_id = $${paramIndex}`);
            values.push(role === 'admin' ? 1 : 2);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const result = await pool.query(`
            UPDATE usuarios SET ${updates.join(', ')} 
            WHERE id = $${paramIndex}
            RETURNING id, nombre, gmail, bio, role_id
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        res.json({
            ...user,
            role: user.role_id === 1 ? 'admin' : 'user'
        });
    } catch (error) {
        console.error('Update usuario error:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
        }

        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Delete usuario error:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

const getCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Get categorias error:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;

        const existingCategoria = await pool.query(
            'SELECT id FROM categorias WHERE nombre = $1',
            [nombre]
        );

        if (existingCategoria.rows.length > 0) {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }

        const result = await pool.query(
            'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create categoria error:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const result = await pool.query(
            'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update categoria error:', error);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM categorias WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Delete categoria error:', error);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};

const getLugares = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lugares ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get lugares error:', error);
        res.status(500).json({ error: 'Error al obtener lugares' });
    }
};

const createLugar = async (req, res) => {
    try {
        const { direccion, lat, lng, place_id } = req.body;

        const result = await pool.query(`
            INSERT INTO lugares (direccion, lat, lng, place_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [direccion || null, lat || null, lng || null, place_id || null]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create lugar error:', error);
        res.status(500).json({ error: 'Error al crear lugar' });
    }
};

const updateLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { direccion, lat, lng, place_id } = req.body;

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (direccion !== undefined) {
            updates.push(`direccion = $${paramIndex}`);
            values.push(direccion);
            paramIndex++;
        }
        if (lat !== undefined) {
            updates.push(`lat = $${paramIndex}`);
            values.push(lat);
            paramIndex++;
        }
        if (lng !== undefined) {
            updates.push(`lng = $${paramIndex}`);
            values.push(lng);
            paramIndex++;
        }
        if (place_id !== undefined) {
            updates.push(`place_id = $${paramIndex}`);
            values.push(place_id);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const result = await pool.query(`
            UPDATE lugares SET ${updates.join(', ')} 
            WHERE id = $${paramIndex}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lugar no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update lugar error:', error);
        res.status(500).json({ error: 'Error al actualizar lugar' });
    }
};

const deleteLugar = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM lugares WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lugar no encontrado' });
        }

        res.json({ message: 'Lugar eliminado exitosamente' });
    } catch (error) {
        console.error('Delete lugar error:', error);
        res.status(500).json({ error: 'Error al eliminar lugar' });
    }
};

const getAsistentes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, e.nombre as evento_nombre
            FROM asistentes a
            JOIN eventos e ON a.evento_id = e.id
            ORDER BY a.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get asistentes error:', error);
        res.status(500).json({ error: 'Error al obtener asistentes' });
    }
};

const deleteAsistente = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM asistentes WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Asistente no encontrado' });
        }

        res.json({ message: 'Asistente eliminado exitosamente' });
    } catch (error) {
        console.error('Delete asistente error:', error);
        res.status(500).json({ error: 'Error al eliminar asistente' });
    }
};

const getAdminDashboard = async (req, res) => {
    try {
        const usuariosCount = await pool.query('SELECT COUNT(*) FROM usuarios');
        const eventosCount = await pool.query('SELECT COUNT(*) FROM eventos');
        const asistentesCount = await pool.query('SELECT COUNT(*) FROM asistentes');

        res.json({
            usuarios: parseInt(usuariosCount.rows[0].count),
            eventos: parseInt(eventosCount.rows[0].count),
            asistentes: parseInt(asistentesCount.rows[0].count)
        });
    } catch (error) {
        console.error('Get admin dashboard error:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getLugares,
    createLugar,
    updateLugar,
    deleteLugar,
    getAsistentes,
    deleteAsistente,
    getAdminDashboard
};
