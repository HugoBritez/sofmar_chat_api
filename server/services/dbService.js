import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.getConnection()
    .then(connection => {
        console.log('Conectado a MySQL');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a MySQL:', err.message);
    });