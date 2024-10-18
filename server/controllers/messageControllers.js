import { pool } from '../services/dbService.js';
import upload  from '../services/multerConfig.js';
import path from 'path';
import { io } from '../index.js';

export const getMessages = async (socket, { lastMessageId = null, limit = 30 }) => {
  try {
    let query = `
      SELECT chat_mensajes.*, chat_usuarios.us_username AS user_name
      FROM chat_mensajes
      INNER JOIN chat_usuarios ON chat_mensajes.me_owner_id = chat_usuarios.id
      ORDER BY chat_mensajes.id DESC
      LIMIT ?
    `;
    const params = [limit];

    if (lastMessageId) {
      query = `
        SELECT chat_mensajes.*, chat_usuarios.us_username AS user_name
        FROM chat_mensajes
        INNER JOIN chat_usuarios ON chat_mensajes.me_owner_id = chat_usuarios.id
        WHERE chat_mensajes.id < ?
        ORDER BY chat_mensajes.id DESC
        LIMIT ?
      `;
      params.unshift(lastMessageId);
    }

    const [rows] = await pool.query(query, params);

    socket.emit('moreMessages', rows.reverse()); // Envía los mensajes en orden ascendente
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    socket.emit('messageError', { error: 'No se pudieron cargar los mensajes' });
  }

};

export const addMessage = async (content, userId, io) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO chat_mensajes (me_contenido, me_send_at, me_owner_id) VALUES (?, NOW(), ?)',
      [content, userId]
    );

    const [rows] = await pool.query(
      'SELECT chat_mensajes.*, chat_usuarios.us_username AS user_name FROM chat_mensajes INNER JOIN chat_usuarios ON chat_mensajes.me_owner_id = chat_usuarios.id WHERE chat_mensajes.id = ?',
      [result.insertId]
    );
    const newMessage = rows[0];
    io.emit('newMessage', newMessage);
    return newMessage;
  } catch (error) {
    console.error('Error al insertar mensaje:', error);
    throw error;
  }
};

export const uploadFile = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error al subir el archivo:', err);
      return res.status(400).json({ error: 'No se pudo subir el archivo' });
    }

    try {
      const fileUrl = `/uploads/${req.file.filename}`;
      const fileExtension = path.extname(req.file.filename).toLowerCase();
      let fileType = 'text';

      if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
        fileType = 'image';
      } else if (['.mp4', '.avi', '.mov'].includes(fileExtension)) {
        fileType = 'video';
      } else if (['.mp3', '.wav'].includes(fileExtension)) {
        fileType = 'audio';
      }else if (['.pdf'].includes(fileExtension)) {
        fileType = 'pdf';
      }

      const [result] = await pool.query(
        'INSERT INTO chat_mensajes (me_contenido, me_send_at, me_owner_id, me_url, me_type) VALUES ("", NOW(), ?, ?, ?)',
        [req.user.id, fileUrl, fileType]
      );

      const [rows] = await pool.query(
        'SELECT chat_mensajes.*, chat_usuarios.us_username AS user_name FROM chat_mensajes INNER JOIN chat_usuarios ON chat_mensajes.me_owner_id = chat_usuarios.id WHERE chat_mensajes.id = ?',
        [result.insertId]
      );

      const newMessage = rows[0];

      io.emit('newMessage', newMessage);

      res.json(newMessage);
    } catch (error) {
      console.error('Error al insertar mensaje con archivo:', error);
      res.status(500).json({ error: 'No se pudo subir el archivo' });
    }
  });
};