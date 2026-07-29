# Gestión de invitados — puesta en marcha

Todo vive en Vercel. No hay servidor aparte: las funciones de `api/` se despliegan
solas con cada `git push`, en el mismo dominio que la invitación.

```
karen-xv/
├─ api/                        ← backend (Vercel Functions, Node)
│  ├─ _lib/
│  │  ├─ auth.js                 cookie de sesión firmada + validación de password
│  │  ├─ id.js                   generador de IDs de 8 caracteres
│  │  └─ supabase.js             cliente con service_role key
│  ├─ login.js                   GET/POST/DELETE  sesión de admin
│  ├─ rsvp.js                    POST             público: guarda la respuesta
│  ├─ invitacion/[id].js         GET              público: datos de una invitación
│  └─ invitados/
│     ├─ index.js                GET/POST         admin: listar y crear
│     └─ [id].js                 DELETE           admin: eliminar
├─ src/
│  ├─ lib/api.js                 cliente HTTP del frontend
│  ├─ lib/useGuest.js            lee ?id= y consulta la invitación
│  └─ pages/Admin.jsx            panel /admin
├─ supabase/schema.sql         ← ejecutar una vez en Supabase
└─ vercel.json                 ← rewrite del SPA (necesario para /admin)
```

---

## 1. Crear la base en Supabase

1. [supabase.com](https://supabase.com) → **New project**. Guarda la contraseña de
   Postgres que te pide (no la vamos a usar aquí, pero no la pierdas).
2. Menú lateral → **SQL Editor** → **New query**.
3. Pega todo el contenido de `supabase/schema.sql` y dale **Run**.
4. **Project Settings → Data API** → copia el **Project URL**.
5. **Project Settings → API Keys** → revela y copia la **`service_role`** (no la `anon`).

> La tabla queda con RLS activado y sin políticas: la `anon key` pública no puede
> leer ni escribir nada. Todo pasa por `/api`, que usa la `service_role`. Eso es lo
> que evita que alguien pueda descargar tu lista de invitados desde el navegador.

## 2. Registrar las variables en Vercel

**Project → Settings → Environment Variables.** Agrega las tres a *Production*,
*Preview* y *Development*:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | el Project URL del paso 1.4 |
| `SUPABASE_SERVICE_ROLE_KEY` | la service_role del paso 1.5 |
| `ADMIN_PASSWORD` | `Gabo#123` |

Ninguna lleva prefijo `VITE_`, a propósito: así Vite **no** las mete en el bundle
del navegador. Solo las funciones de `api/` las pueden leer.

Opcional: `ADMIN_SESSION_SECRET` para firmar la cookie con algo distinto al
password. Si la omites se usa `ADMIN_PASSWORD` (cambiar el password cerrará las
sesiones abiertas, que normalmente es lo que quieres).

## 3. Desplegar

```bash
git add -A
git commit -m "Gestión de invitados"
git push
```

Vercel detecta `api/` sola. No hay que cambiar la configuración del proyecto.

## 4. Desarrollo local

`npm run dev` levanta **solo** el frontend: `/api/*` responderá 404. Para probar
las funciones necesitas el CLI de Vercel:

```bash
npm i -g vercel
vercel link          # una sola vez
vercel env pull      # baja las variables a .env.local
vercel dev           # frontend + API juntos en http://localhost:3000
```

---

## Cómo se usa

**Panel:** `tudominio.vercel.app/admin` → password → agregar invitados.

Cada invitado se crea con un ID de 8 caracteres (sin `0/O` ni `1/I/L`, para que se
pueda dictar por teléfono sin confusiones). El botón **Copiar enlace** te da la URL
personalizada para mandar por WhatsApp:

```
https://tudominio.vercel.app/?id=K7M2QP4R
```

El selector **Enlace del diseño** decide si el enlace apunta a Opción 3 (`/`) o al
Clásico (`/clasico`). Cámbialo antes de copiar.

**Lo que ve el invitado** al abrir su enlace, en la sección de confirmación:
su nombre de familia, cuántos lugares tiene, y los botones **Asistiré** /
**No asistiré**. Puede cambiar su respuesta después; el panel refleja siempre la
última. Si alguien abre la invitación **sin** `?id=`, todo funciona igual y la
confirmación cae de vuelta al botón de WhatsApp.

---

## Notas de seguridad

Lo que **sí** está resuelto:

- El password nunca sale en el JS del frontend: se valida en el servidor.
- La sesión es una cookie `HttpOnly` firmada con HMAC-SHA256 y vence a las 8 horas.
  Un XSS no puede leerla y el cliente no puede fabricarla ni extenderla.
- La `service_role` key vive solo en las variables de entorno de Vercel.
- El endpoint público de la invitación nunca devuelve el campo `nombre` (control
  interno) y no permite listar invitados: hay que conocer el ID exacto.
- El endpoint público de RSVP solo puede escribir `asistira` y `respondido_en`.
- Comparaciones de tiempo constante en el password y en la firma de la cookie.

Lo que **no**, y conviene que sepas:

- **`Gabo#123` es un password corto y adivinable.** Hay una penalización de 600 ms
  por intento fallido, pero no es un rate limit real (las funciones serverless no
  comparten estado). Cuando quieras cerrarlo bien, cambia `ADMIN_PASSWORD` en Vercel
  por algo largo y aleatorio — no requiere tocar código.
- **El ID de 8 caracteres es la única protección del RSVP de cada invitado.** Son
  ~8.5×10¹¹ combinaciones, así que adivinarlo no es práctico, pero quien reciba un
  enlace reenviado puede responder por esa familia. Para una invitación de XV es un
  intercambio razonable: pedir login a los invitados los haría abandonar.
- **`/admin` no está oculto de verdad.** No aparece en el `OptionSwitcher` ni hay
  enlaces hacia él, pero cualquiera que teclee la ruta ve la pantalla de password.
  La protección real es el password, no que la URL sea secreta.
