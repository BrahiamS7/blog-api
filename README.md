API Blog

API REST para un sistema de blog con autenticación y control de roles, construida con Node.js, Express y Prisma sobre PostgreSQL.

Tecnologías
Node.js + Express — servidor y enrutamiento
PostgreSQL — base de datos relacional
Prisma — ORM para modelado y consultas a la base de datos
JWT (jsonwebtoken) — autenticación basada en tokens
bcrypt — hasheo seguro de contraseñas

Funcionalidades
CRUD completo de Usuarios y Posts
Relación uno-a-muchos entre Usuario y Post (un usuario autor de múltiples posts)
Registro y login con contraseñas encriptadas
Autenticación mediante JWT
Autorización por roles (ADMIN / USUARIO)
Rutas protegidas: solo usuarios con rol ADMIN pueden gestionar usuarios y posts

Estructura del proyecto
api-blog/
├── index.js
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── usuarios.routes.js
│   └── posts.routes.js
├── controllers/
│   ├── usuarios.controller.js
│   └── posts.controller.js
├── middlewares/
│   └── auth.middleware.js
└── utils/
    └── prisma.js

Variables de entorno

Crea un archivo .env en la raíz con las siguientes variables:

DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"
JWT_SECRET="tu_clave_secreta"

Instalación y uso local
bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/api-blog.git
cd api-blog

# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección anterior)

# Aplicar migraciones
npx prisma migrate dev

# Iniciar el servidor
node index.js

El servidor corre por defecto en http://localhost:3000.

Endpoints
Usuarios
Método	Ruta	Descripción	Protegida
POST	/usuarios	Registrar un usuario nuevo	        Admin
POST	/usuarios/login	Iniciar sesión (devuelve JWT)	Público
GET	/usuarios	Listar todos los usuarios	            Admin
GET	/usuarios/:id	Obtener un usuario por id	        Admin
PUT	/usuarios/:id	Actualizar un usuario	            Admin
DELETE	/usuarios/:id	Eliminar un usuario	            Admin

Posts
Método	Ruta	Descripción	Protegida
GET	/posts	Listar todos los posts	                    Admin
GET	/posts/:id	Obtener un post por id	                Admin
POST	/posts	Crear un post nuevo	                    Admin
PUT	/posts/:id	Actualizar un post	                    Admin
DELETE	/posts/:id	Eliminar un post	                Admin

Las rutas protegidas requieren un header:

Authorization: Bearer <token>
Demo en vivo

[Agregar aquí el link una vez desplegado]

Autor

Brahiam Soto - https://github.com/BrahiamS7