const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const register = async (req, res) => {
    try {
        const { nombre, gmail, password, bio } = req.body;

        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE gmail = $1',
            [gmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (nombre, gmail, password_hash, bio, role_id) 
             VALUES ($1, $2, $3, $4, 2) RETURNING id, nombre, gmail, bio, role_id`,
            [nombre, gmail, passwordHash, bio || null]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, role: user.role_id === 1 ? 'admin' : 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                nombre: user.nombre,
                gmail: user.gmail,
                bio: user.bio,
                role: user.role_id === 1 ? 'admin' : 'user'
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { gmail, password } = req.body;

        const result = await pool.query(
            'SELECT id, nombre, gmail, bio, password_hash, role_id FROM usuarios WHERE gmail = $1',
            [gmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role_id === 1 ? 'admin' : 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
        );

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                nombre: user.nombre,
                gmail: user.gmail,
                bio: user.bio,
                role: user.role_id === 1 ? 'admin' : 'user'
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

const getPerfil = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, gmail, bio, created_at FROM usuarios WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get perfil error:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

const updatePerfil = async (req, res) => {
    try {
        const { nombre, bio } = req.body;
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

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(req.user.id);
        const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, nombre, gmail, bio`;

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update perfil error:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { gmail } = req.body;

        const userResult = await pool.query(
            'SELECT id FROM usuarios WHERE gmail = $1',
            [gmail]
        );

        if (userResult.rows.length === 0) {
            return res.json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' });
        }

        const user = userResult.rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);

        await pool.query(
            'INSERT INTO password_reset_tokens (usuario_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, token, expiresAt]
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: gmail,
                subject: 'Restablecer contraseña - Conferencistas',
                html: `
                    <h1>Restablecer contraseña</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${resetUrl}">${resetUrl}</a>
                    <p>Este enlace expira en 1 hora.</p>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                `
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
        }

        res.json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const tokenResult = await pool.query(
            `SELECT id, usuario_id FROM password_reset_tokens 
             WHERE token = $1 AND expires_at > NOW() AND used = FALSE`,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        const tokenRecord = tokenResult.rows[0];
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
            [passwordHash, tokenRecord.usuario_id]
        );

        await pool.query(
            'UPDATE password_reset_tokens SET used = TRUE WHERE id = $1',
            [tokenRecord.id]
        );

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
};

module.exports = {
    register,
    login,
    getPerfil,
    updatePerfil,
    forgotPassword,
    resetPassword
};
