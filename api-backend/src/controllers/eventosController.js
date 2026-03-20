const pool = require('../config/db');

const getAllEventos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id, e.nombre, e.descripcion, e.capacidad, e.horario, e.fecha, 
                e.costo_entrada, e.created_at,
                u.id as host_id, u.nombre as host_nombre,
                l.id as lugar_id, l.direccion as lugar_direccion,
                COALESCE(
                    json_agg(
                        json_build_object('id', c.id, 'nombre', c.nombre)
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) as categorias,
                (SELECT COUNT(*) FROM asistentes WHERE evento_id = e.id) as asistentes_count
            FROM eventos e
            JOIN usuarios u ON e.host_id = u.id
            LEFT JOIN lugares l ON e.lugar_id = l.id
            LEFT JOIN evento_categorias ec ON e.id = ec.evento_id
            LEFT JOIN categorias c ON ec.categoria_id = c.id
            GROUP BY e.id, u.id, l.id
            ORDER BY e.fecha DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Get all eventos error:', error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

const getEventoById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                e.id, e.nombre, e.descripcion, e.capacidad, e.horario, e.fecha, 
                e.costo_entrada, e.created_at,
                u.id as host_id, u.nombre as host_nombre, u.bio as host_bio,
                l.id as lugar_id, l.direccion as lugar_direccion,
                COALESCE(
                    json_agg(
                        json_build_object('id', c.id, 'nombre', c.nombre)
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) as categorias,
                (SELECT COUNT(*) FROM asistentes WHERE evento_id = e.id) as asistentes_count
            FROM eventos e
            JOIN usuarios u ON e.host_id = u.id
            LEFT JOIN lugares l ON e.lugar_id = l.id
            LEFT JOIN evento_categorias ec ON e.id = ec.evento_id
            LEFT JOIN categorias c ON ec.categoria_id = c.id
            WHERE e.id = $1
            GROUP BY e.id, u.id, l.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get evento by id error:', error);
        res.status(500).json({ error: 'Error al obtener evento' });
    }
};

const getMyEventos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id, e.nombre, e.descripcion, e.capacidad, e.horario, e.fecha, 
                e.costo_entrada, e.created_at,
                COALESCE(
                    json_agg(
                        json_build_object('id', c.id, 'nombre', c.nombre)
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) as categorias,
                (SELECT COUNT(*) FROM asistentes WHERE evento_id = e.id) as asistentes_count
            FROM eventos e
            LEFT JOIN lugares l ON e.lugar_id = l.id
            LEFT JOIN evento_categorias ec ON e.id = ec.evento_id
            LEFT JOIN categorias c ON ec.categoria_id = c.id
            WHERE e.host_id = $1
            GROUP BY e.id
            ORDER BY e.fecha DESC
        `, [req.user.id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Get my eventos error:', error);
        res.status(500).json({ error: 'Error al obtener tus eventos' });
    }
};

const createEvento = async (req, res) => {
    try {
        const { nombre, descripcion, capacidad, horario, fecha, costo_entrada, lugar_id, categorias } = req.body;

        const eventoResult = await pool.query(`
            INSERT INTO eventos (nombre, descripcion, host_id, capacidad, horario, fecha, costo_entrada, lugar_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [nombre, descripcion || null, req.user.id, capacidad, horario || null, fecha, costo_entrada || 0, lugar_id || null]);

        const evento = eventoResult.rows[0];

        if (categorias && categorias.length > 0) {
            const values = categorias.map((catId, index) => 
                `(${evento.id}, $${index + 1})`
            ).join(', ');
            
            await pool.query(`
                INSERT INTO evento_categorias (evento_id, categoria_id) 
                VALUES ${values}
                ON CONFLICT DO NOTHING
            `, categorias);
        }

        const result = await pool.query(`
            SELECT 
                e.*, 
                COALESCE(
                    json_agg(
                        json_build_object('id', c.id, 'nombre', c.nombre)
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) as categorias
            FROM eventos e
            LEFT JOIN evento_categorias ec ON e.id = ec.evento_id
            LEFT JOIN categorias c ON ec.categoria_id = c.id
            WHERE e.id = $1
            GROUP BY e.id
        `, [evento.id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create evento error:', error);
        res.status(500).json({ error: 'Error al crear evento' });
    }
};

const updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, capacidad, horario, fecha, costo_entrada, lugar_id, categorias } = req.body;

        const existingEvento = await pool.query(
            'SELECT host_id FROM eventos WHERE id = $1',
            [id]
        );

        if (existingEvento.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (existingEvento.rows[0].host_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para editar este evento' });
        }

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramIndex}`);
            values.push(nombre);
            paramIndex++;
        }
        if (descripcion !== undefined) {
            updates.push(`descripcion = $${paramIndex}`);
            values.push(descripcion);
            paramIndex++;
        }
        if (capacidad !== undefined) {
            updates.push(`capacidad = $${paramIndex}`);
            values.push(capacidad);
            paramIndex++;
        }
        if (horario !== undefined) {
            updates.push(`horario = $${paramIndex}`);
            values.push(horario);
            paramIndex++;
        }
        if (fecha !== undefined) {
            updates.push(`fecha = $${paramIndex}`);
            values.push(fecha);
            paramIndex++;
        }
        if (costo_entrada !== undefined) {
            updates.push(`costo_entrada = $${paramIndex}`);
            values.push(costo_entrada);
            paramIndex++;
        }
        if (lugar_id !== undefined) {
            updates.push(`lugar_id = $${paramIndex}`);
            values.push(lugar_id);
            paramIndex++;
        }

        if (updates.length > 0) {
            values.push(id);
            await pool.query(
                `UPDATE eventos SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
                values
            );
        }

        if (categorias !== undefined) {
            await pool.query('DELETE FROM evento_categorias WHERE evento_id = $1', [id]);
            
            if (categorias.length > 0) {
                const values = categorias.map((catId, index) => 
                    `(${id}, $${index + 1})`
                ).join(', ');
                
                await pool.query(`
                    INSERT INTO evento_categorias (evento_id, categoria_id) 
                    VALUES ${values}
                    ON CONFLICT DO NOTHING
                `, categorias);
            }
        }

        const result = await pool.query(`
            SELECT 
                e.*, 
                COALESCE(
                    json_agg(
                        json_build_object('id', c.id, 'nombre', c.nombre)
                    ) FILTER (WHERE c.id IS NOT NULL), '[]'
                ) as categorias
            FROM eventos e
            LEFT JOIN evento_categorias ec ON e.id = ec.evento_id
            LEFT JOIN categorias c ON ec.categoria_id = c.id
            WHERE e.id = $1
            GROUP BY e.id
        `, [id]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update evento error:', error);
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
};

const deleteEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const existingEvento = await pool.query(
            'SELECT host_id FROM eventos WHERE id = $1',
            [id]
        );

        if (existingEvento.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (existingEvento.rows[0].host_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este evento' });
        }

        await pool.query('DELETE FROM eventos WHERE id = $1', [id]);

        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('Delete evento error:', error);
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
};

const participar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono } = req.body;

        const existingEvento = await pool.query(
            'SELECT id, nombre, capacidad FROM eventos WHERE id = $1',
            [id]
        );

        if (existingEvento.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const asistentesCount = await pool.query(
            'SELECT COUNT(*) FROM asistentes WHERE evento_id = $1',
            [id]
        );

        if (parseInt(asistentesCount.rows[0].count) >= existingEvento.rows[0].capacidad) {
            return res.status(400).json({ error: 'El evento ha alcanzado su capacidad máxima' });
        }

        await pool.query(`
            INSERT INTO asistentes (evento_id, email, nombre, telefono)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (evento_id, email) DO NOTHING
        `, [id, email, nombre, telefono || null]);

        res.status(201).json({ 
            message: 'Te has registrado exitosamente como asistente',
            redirectTo: `/eventos/${id}/confirmacion`
        });
    } catch (error) {
        console.error('Participar error:', error);
        res.status(500).json({ error: 'Error al registrarse como asistente' });
    }
};

const getAsistentes = async (req, res) => {
    try {
        const { id } = req.params;

        const existingEvento = await pool.query(
            'SELECT host_id FROM eventos WHERE id = $1',
            [id]
        );

        if (existingEvento.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (existingEvento.rows[0].host_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para ver los asistentes' });
        }

        const result = await pool.query(`
            SELECT id, email, nombre, telefono, created_at
            FROM asistentes
            WHERE evento_id = $1
            ORDER BY created_at DESC
        `, [id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Get asistentes error:', error);
        res.status(500).json({ error: 'Error al obtener asistentes' });
    }
};

const getCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre FROM categorias ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Get categorias error:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const getLugares = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, direccion, lat, lng, place_id FROM lugares ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get lugares error:', error);
        res.status(500).json({ error: 'Error al obtener lugares' });
    }
};

module.exports = {
    getAllEventos,
    getEventoById,
    getMyEventos,
    createEvento,
    updateEvento,
    deleteEvento,
    participar,
    getAsistentes,
    getCategorias,
    getLugares
};
