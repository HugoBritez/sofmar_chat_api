import { pool } from '../services/dbService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Ruta de Signup (Registro)
export const signup = async (req, res) => {
    const { us_nombre, us_username, us_password } = req.body;

    if (!us_nombre || !us_username || !us_password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM chat_usuarios WHERE us_username = ?', [us_username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(us_password, 10);

        const [result] = await pool.query(
            'INSERT INTO chat_usuarios (us_nombre, us_username, us_password, us_status, us_created_at) VALUES (?, ?, ?, 2, NOW())', 
            [us_nombre, us_username, hashedPassword]
        );
        const userId = result.insertId;

        res.status(201).json({ message: 'Usuario registrado exitosamente', id: userId });
    } catch (e) {
        console.error('Error al registrar usuario:', e);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// Ruta de Login (Inicio de sesión)
export const login = async (req, res) => {
    const { us_username, us_password } = req.body;

    if (!us_username || !us_password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario existe en la tabla chat_usuarios
        const [userResult] = await pool.query('SELECT * FROM chat_usuarios WHERE us_username = ?', [us_username]);
        const user = userResult[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Comparar la contraseña ingresada con el hash almacenado
        const isMatch = await bcrypt.compare(us_password, user.us_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.id, username: user.us_username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.us_username,
                status: user.us_status
            }
        });
    } catch (e) {
        console.error('Error al iniciar sesión:', e);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};
