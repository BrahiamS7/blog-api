Blog con Roles de Usuario y Administrador

Plataforma de blog donde los usuarios pueden registrarse, iniciar sesión y gestionar sus propias publicaciones, mientras que los administradores tienen control adicional sobre usuarios y contenido.

Características

Usuarios

Registro e inicio de sesión
Crear, editar y eliminar sus propios posts
Ver posts propios y de otros usuarios

Administradores

Todo lo que puede hacer un usuario
Eliminar posts de cualquier usuario
Crear, editar y eliminar usuarios
Tecnologías

Backend

Node.js
Prisma (ORM)
PostgreSQL

Frontend

React
Vite
Requisitos previos

Antes de empezar, asegúrate de tener instalado:

Node.js (v18 o superior recomendado)
PostgreSQL corriendo localmente o en un servicio remoto
npm o yarn
Instalación
Clona el repositorio
bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Instala las dependencias del backend
bash
cd backend
npm install
Instala las dependencias del frontend
bash
cd ../frontend
npm install
Configura las variables de entorno (ver sección de abajo)
Ejecuta las migraciones de Prisma
bash
cd ../backend
npx prisma migrate dev
(Opcional) Crea un usuario administrador inicial mediante un seed script o directamente en la base de datos, ya que por defecto los registros nuevos suelen crearse como usuario normal.
Variables de entorno

Crea un archivo .env en la carpeta backend con las siguientes variables:

env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
JWT_SECRET="tu_secreto_aqui"
PORT=3000

Ajusta los nombres de las variables según cómo las hayas definido en tu código.

Uso

Debes levantar el backend y el frontend en terminales separadas.

Terminal 1 — Backend

bash
cd backend
npm run dev

Terminal 2 — Frontend

bash
cd frontend
npm run dev

Luego abre tu navegador en http://localhost:5173 (o el puerto que indique Vite).

Roles y permisos
Acción	Usuario	Admin
Registrarse / iniciar sesión	✅	✅
Crear post	✅	✅
Ver posts de otros	✅	✅
Editar sus propios posts	✅	✅
Eliminar sus propios posts	✅	✅
Eliminar posts de otros usuarios	❌	✅
Crear/editar/eliminar usuarios	❌	✅
Estructura del proyecto
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
Roadmap / Mejoras futuras
 Comentarios en posts
 Categorías y etiquetas
 Búsqueda de posts
 Subida de imágenes en posts
Contribución

Las contribuciones son bienvenidas. Para contribuir:

Haz un fork del proyecto
Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
Haz commit de tus cambios (git commit -m 'Agrega nueva funcionalidad')
Haz push a tu rama (git push origin feature/nueva-funcionalidad)
Abre un Pull Request
📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

👤 Autor

Tu nombre - @tu-usuario
