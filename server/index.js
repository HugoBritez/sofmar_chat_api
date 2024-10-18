import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { authenticateToken } from './utils/authMiddleware.js';
import { addMessage, getMessages } from './controllers/messageControllers.js';
import traerUsuarios from './routes/traerUsuarios.js';
import { pool } from './services/dbService.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

export { io };

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api', traerUsuarios);
app.use('/uploads', express.static('uploads'));


// Middleware de autenticación para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
});

io.on('connection', async (socket) => {
  console.log('Usuario conectado:', socket.user.id);

  try {

    await pool.query('UPDATE chat_usuarios SET us_status = 1 WHERE id = ?', [socket.user.id]);
    io.emit('userStatusChanged', { userId: socket.user.id, online: true });

    const [rows] = await pool.query('SELECT id, us_status FROM chat_usuarios WHERE us_status = 1');
    const onlineUsers = rows.map(row => ({ userId: row.id, online: row.us_status === 1 }));

    socket.emit('onlineUsers', onlineUsers);
  } catch (error) {
    console.error('Error al actualizar el estado del usuario:', error);
  }
  
  socket.on('getMessages', (data) => {
    getMessages(socket, data);
  });

  socket.on('sendMessage', async (msg) => {
    const userId = socket.user.id;
    try {
      const newMessage = await addMessage(msg, userId, io);
      io.emit('newMessage', newMessage);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('messageError', { error: 'No se pudo enviar el mensaje' });
    }
  });

  socket.on('disconnect', async () => {
    console.log('Usuario desconectado:', socket.user.id);
    try {
      // Actualizar el estado del usuario a 'desconectado' (us_status = 2)
      await pool.query('UPDATE chat_usuarios SET us_status = 0 WHERE id = ?', [socket.user.id]);
      io.emit('userStatusChanged', { userId: socket.user.id, online: false });
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});