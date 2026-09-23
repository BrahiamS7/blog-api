# Eco

Un lugar para contar las cosas. Eco es una red de notas públicas: cualquiera puede escribir, leer lo que escriben otros y responder con un "eco" (like). Pensada para cualquier edad — sin fricción para registrarse ni para publicar.

**Demo:** [https://blog-api-jade-iota.vercel.app](https://blog-api-jade-iota.vercel.app)
**API:** [https://blog-api-5ysv.onrender.com](https://blog-api-5ysv.onrender.com)

## Qué se puede hacer

**Cualquier persona con cuenta**
- Registrarse e iniciar sesión
- Escribir, editar y eliminar sus propias publicaciones
- Leer las publicaciones de todos, o filtrar solo las propias
- Dar "eco" (like) a una publicación

**Administración**
- Todo lo anterior, más:
- Editar o eliminar publicaciones de cualquier persona
- Crear, editar y eliminar cuentas de usuario

## Stack

| | |
|---|---|
| **Backend** | Node.js, Express 5, Prisma, PostgreSQL |
| **Auth** | JWT en cookie `httpOnly` (no en `localStorage`), bcrypt para contraseñas |
| **Frontend** | React 19, Vite, React Router |
| **Testing** | Jest + Supertest |
| **Deploy** | Render (API) + Vercel (frontend) |

## Estructura del proyecto

```
.
├── backend/
│   ├── controllers/       # lógica de negocio (usuarios, posts)
│   ├── routes/            # definición de endpoints
│   ├── middleware/        # auth (verificar token, chequeo de rol admin)
│   ├── prisma/            # schema.prisma + migraciones
│   ├── utils/prisma.js    # cliente de Prisma
│   ├── __tests__/         # tests de integración (Jest + Supertest)
│   └── index.js           # app de Express (sin listen — la usan tests y server.js)
│   └── server.js          # punto de entrada real (llama app.listen)
└── frontend/
    └── src/
        ├── pages/         # Login, Register, Dashboard, Usuarios
        ├── components/    # BrandMark, ProtectedRoute
        ├── services/      # llamadas a la API (auth, posts, usuarios)
        └── api/axios.js   # cliente axios (withCredentials para la cookie)
```

## Correr en local

Necesitás Node 18+ y una base PostgreSQL (local o remota).

```bash
git clone https://github.com/BrahiamS7/blog-api.git
cd blog-api
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # completá DATABASE_URL y generá un JWT_SECRET propio
npx prisma migrate dev
npm run dev             # http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env    # por defecto ya apunta a http://localhost:3000
npm run dev              # http://localhost:5173
```

No hay que crear un usuario admin a mano: registrate desde `/register` y vas a quedar como `USUARIO`. Para tener un admin, creá una cuenta y subile el rol a `ADMIN` directamente en la base, o promové a alguien ya registrado desde otra cuenta admin.

## Variables de entorno

**`backend/.env`**

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens — generá uno propio, no reutilices el de ejemplo |
| `PORT` | Puerto del servidor (default `3000`) |
| `FRONTEND_URL` | Origen permitido por CORS (default `http://localhost:5173`). En producción, la URL de Vercel |
| `NODE_ENV` | En `production`, la cookie de sesión se marca `secure` + `sameSite=none` (necesario para que funcione cross-domain) |

**`frontend/.env`**

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API |

## Testing

```bash
cd backend
npm run migrate:test   # aplica las migraciones sobre una base de test separada (.env.test)
npm test
```

Los tests cubren login, registro público, email duplicado, restricciones de rol admin, creación de posts y autorización cruzada entre usuarios (que alguien no pueda editar el post de otra persona).

## Deploy

**Backend (Render)**
- Start command: `node server.js` (**no** `node index.js` — ese archivo solo exporta la app, no abre el puerto)
- Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`

**Frontend (Vercel)**
- Variable de entorno: `VITE_API_URL` apuntando a la URL de Render

## Notas sobre el frontend público

El frontend pasó por un checklist de sitio público (SEO básico, accesibilidad, favicon, Open Graph, breakpoints móviles). Lo que **no** se implementó, y por qué:

- **Política de privacidad y términos de uso** — Eco es un proyecto de portafolio personal, no un negocio registrado que recolecte datos con fines comerciales. Redactar una política de privacidad real requeriría inventar una identidad legal falsa (razón social, NIT, dirección), así que se dejó afuera a propósito en vez de fabricar placeholders. Si en algún momento se convierte en un producto real, hay que retomar esto con datos reales.
- **Dirección de contacto real** — mismo motivo: no hay un negocio físico detrás.
- **Banner de cookies** — la única cookie que usa el sitio es la de sesión (`httpOnly`, estrictamente necesaria para el login). No hay cookies de analítica ni publicidad, así que no corresponde pedir consentimiento todavía.
- **Analíticas** — no hay ninguna herramienta instalada. Si se agrega en el futuro (Plausible/Umami son más livianas y respetuosas con la privacidad que GA4), ahí sí pasa a ser necesario el banner de cookies.
- **Página de "gracias"** — no hay checkout ni formulario de lead cuyo envío amerite una confirmación separada; el registro redirige directo al feed.

## Licencia

Sin licencia definida — proyecto de portafolio.
