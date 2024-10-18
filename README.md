# Documentación del Proyecto Sofmar Chat API

## Índice

1. [Descripción del Proyecto](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#descripci%C3%B3n-del-proyecto)
2. [Estructura del Proyecto](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#estructura-del-proyecto)
3. [Configuración del Entorno](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#configuraci%C3%B3n-del-entorno)
4. Instalación
5. [Ejecución del Proyecto](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#ejecuci%C3%B3n-del-proyecto)
6. [Rutas de la API](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#rutas-de-la-api)
    - [Rutas de Usuarios](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#rutas-de-usuarios)
    - [Rutas de Mensajes](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#rutas-de-mensajes)
    - [Rutas de Usuarios (Traer Usuarios)](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#rutas-de-usuarios-traer-usuarios)
7. [Base de Datos](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#base-de-datos)
8. Middleware
    - Autenticación
9. Servicios
    - [Base de Datos](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#base-de-datos-1)
    - [Configuración de Multer](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#configuraci%C3%B3n-de-multer)
10. Controladores
    - [Controladores de Usuarios](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#controladores-de-usuarios)
    - [Controladores de Mensajes](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#controladores-de-mensajes)
11. Pruebas
12. [Créditos y Licencias](notion://www.notion.so/Documentaci-n-del-Proyecto-de-API-de-Chat-1203ca9ee20b80f4a47edf470a02381a#cr%C3%A9ditos-y-licencias)

## Descripción del Proyecto

Sofmar Chat API es una aplicación de chat que permite a los usuarios registrarse, iniciar sesión, enviar mensajes y subir archivos. La aplicación está construida utilizando Node.js, Express, y MySQL.

## Estructura del Proyecto

```
.env
.mocharc.cjs
client/
	index.html
	login.html
	login.js
package.json
server/
	controllers/
		messageControllers.js
		userControllers.js
	index.js
	routes/
		messageRoutes.js
		traerUsuarios.js
		userRoutes.js
	services/
		dbService.js
		multerConfig.js
	test/
		helloWorld.test.js
	utils/
		authMiddleware.js
		logger.js
tables.txt
uploads/
	file-1729187600102-658964791.docx
	file-1729189895228-850551720.docx

```

## Configuración del Entorno

El archivo

.env

contiene las variables de entorno necesarias para la configuración de la base de datos y el JWT:

```
DB_USER=root
DB_HOST=localhost
DB_NAME=p

DB_PASSWORD='root'
DB_PORT=3306
JWT_SECRET=Sofmar17052006

```

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```
npm install

```

## Ejecución del Proyecto

Para ejecutar el proyecto en modo desarrollo, utiliza el siguiente comando:

```
npm run dev

```

## Rutas de la API

### Rutas de Usuarios

- **POST /signup**: Registra un nuevo usuario.
    - Controlador: `signup`
- **POST /login**: Inicia sesión un usuario.
    - Controlador: `login`

### Rutas de Mensajes

- **GET /api/messages**: Obtiene los mensajes.
    - Middleware: `authenticateToken`
    - Controlador: `getMessages`
- **POST /api/messages/upload**: Sube un archivo.
    - Controlador: `uploadFile`

### Rutas de Usuarios (Traer Usuarios)

- **GET /api/usuarios**: Obtiene la lista de usuarios.
    - Middleware: `authenticateToken`
    - Controlador: `getUsuarios`

## Base de Datos

El archivo

tables.txt

contiene las definiciones de las tablas de la base de datos:

```sql
CREATE TABLE IF NOT EXISTS chat_archivos (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255),
  `file_url` VARCHAR(255),
  `file_message_id` BIGINT
);
CREATE TABLE IF NOT EXISTS chat_mensajes (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `me_contenido` VARCHAR(1000) NOT NULL,
  `me_send_at` DATETIME NOT NULL,
  `me_owner_id` BIGINT,
  `me_remitente` BIGINT
);
CREATE TABLE IF NOT EXISTS chat_usuarios (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `us_nombre` VARCHAR(255) NOT NULL,
  `us_username` VARCHAR(255) NOT NULL,
  `us_password` VARCHAR(255) NOT NULL,
  `us_status` BIGINT NOT NULL,
  `us_created_at` DATETIME NOT NULL,
  `us_avatar_url` VARCHAR(255)
);
ALTER TABLE chat_archivos ADD CONSTRAINT files_file_message_id_fk FOREIGN KEY (`file_message_id`) REFERENCES chat_mensajes (`id`);
ALTER TABLE chat_mensajes ADD CONSTRAINT messages_me_owner_id_fk FOREIGN KEY (`me_owner_id`) REFERENCES chat_usuarios (`id`);

```

## Middleware

### Autenticación

El middleware de autenticación se encuentra en `authMiddleware.js` y se utiliza para proteger las rutas que requieren autenticación.

## Servicios

### Base de Datos

La configuración de la base de datos se encuentra en `dbService.js`. Utiliza `mysql2/promise` para crear un pool de conexiones a la base de datos MySQL.

```
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

```

### Configuración de Multer

La configuración de Multer para la subida de archivos se encuentra en `multerConfig.js`. Define el almacenamiento, el filtro de archivos y los límites de tamaño de archivo.

```
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limita el tamaño del archivo a 5MB
  }
});

export default upload;

```

## Controladores

### Controladores de Usuarios

Los controladores de usuarios se encuentran en `userControllers.js` y manejan el registro y el inicio de sesión de los usuarios.

### Controladores de Mensajes

Los controladores de mensajes se encuentran en `messageControllers.js` y manejan la inserción de mensajes y la subida de archivos.

```
import { pool } from '../services/dbService.js';
import upload from '../services/multerConfig.js';
import { io } from '../index.js';

export const getMessages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT chat_mensajes.*, chat_usuarios.us_username AS user_name FROM chat_mensajes INNER JOIN chat_usuarios ON chat_mensajes.me_owner_id = chat_usuarios.id ORDER BY chat_mensajes.me_send_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los mensajes' });
  }
};

export const uploadFile = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error al subir archivo:', err);
      return res.status(500).json({ error: 'No se pudo subir el archivo' });
    }

    const { file } = req;
    const { message } = req.body;

    try {
      const [result] = await pool.query(
        'INSERT INTO chat_mensajes (me_contenido, me_send_at, me_owner_id, me_remitente) VALUES (?, NOW(), ?, ?)',
        [message, req.user.id, req.user.id]
      );

      await pool.query(
        'INSERT INTO chat_archivos (file_name, file_url, file_message_id) VALUES (?, ?, ?)',
        [file.filename, file.path, result.insertId]
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

```

## Pruebas

Las pruebas se encuentran en el directorio `test`. Actualmente, solo hay una prueba de ejemplo en `helloWorld.test.js`.

Para ejecutar las pruebas, utiliza el siguiente comando:

```
npm test

```

El archivo de configuración de Mocha se encuentra en

.mocharc.cjs

:

```
module.exports = {
  spec: 'server/test/**/*.test.js'
};

```

## Créditos y Licencias

Este proyecto fue desarrollado por Sofmar Sistema EAS. Todos los derechos reservados.

---
