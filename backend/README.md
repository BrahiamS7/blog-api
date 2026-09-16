# Eco — backend

API REST en Express + Prisma + PostgreSQL. Ver el [README principal](../README.md) para descripción del proyecto, instrucciones de instalación, variables de entorno y deploy.

## Endpoints

| Método | Ruta | Protegida |
|---|---|---|
| POST | `/usuarios/registro` | Pública |
| POST | `/usuarios/login` | Pública (con rate limit) |
| POST | `/usuarios/logout` | Requiere sesión |
| GET | `/usuarios` | Admin |
| GET | `/usuarios/:id` | Admin |
| POST | `/usuarios` | Admin |
| PUT | `/usuarios/:id` | Admin |
| DELETE | `/usuarios/:id` | Admin |
| GET | `/posts` | Requiere sesión |
| GET | `/posts/mis-posts` | Requiere sesión |
| GET | `/posts/:id` | Requiere sesión |
| POST | `/posts` | Requiere sesión |
| PUT | `/posts/:id` | Autor del post, o admin |
| DELETE | `/posts/:id` | Autor del post, o admin |
| POST | `/posts/:id/like` | Requiere sesión |

La sesión se identifica por una cookie `httpOnly` que se setea en el login — no hace falta enviar ningún header manualmente.
