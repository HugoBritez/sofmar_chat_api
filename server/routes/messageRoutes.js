import express from 'express';
import { pool } from '../services/dbService.js';
import { authenticateToken } from '../utils/authMiddleware.js';
import { uploadFile } from '../controllers/messageControllers.js';

const router = express.Router();

// Ruta para obtener los mensajes (ahora solo como respaldo, principalmente manejado por sockets)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chat_mensajes ORDER BY me_send_at ASC LIMIT 50');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

router.post('/upload', uploadFile);

export default router;