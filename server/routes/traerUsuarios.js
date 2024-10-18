import express from 'express';
import { pool } from '../services/dbService.js';
import { authenticateToken } from '../utils/authMiddleware.js';


const router = express.Router();

router.get('/usuarios', authenticateToken,async (req, res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM chat_usuarios');
        res.json(rows);
    }catch(e){
        console.error('Error al obtener usuarios:', e);
        res.status(500).json({error: 'Error al obtener usuarios'});
    }
}
)

export default router;