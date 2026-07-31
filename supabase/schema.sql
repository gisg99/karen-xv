-- ============================================================================
--  karen-xv · Esquema de la base de datos
--  Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- ============================================================================

create table if not exists invitados (
  -- 8 caracteres alfanuméricos generados en el servidor (api/_lib/id.js).
  -- Es también el token del enlace personalizado: /?id=K7M2QP4R
  id            char(8)      primary key,

  -- Nombre de control interno. Solo se ve en /admin, nunca lo expone la API pública.
  nombre        varchar(100) not null,

  -- Nombre formal que aparece en la invitación ("Familia González Osorio").
  familia       varchar(100) not null,

  -- Postgres no tiene TINYINT; smallint es el equivalente más cercano.
  boletos       smallint     not null default 1 check (boletos between 1 and 20),

  -- true = asistirá · false = no asistirá · null = todavía no responde
  asistira      boolean,

  -- Cuántos de sus boletos usará el invitado al confirmar. null mientras no
  -- confirme asistencia (o si responde que no asiste). Nunca puede exceder
  -- `boletos`; esa validación se hace en api/rsvp.js.
  boletos_confirmados smallint check (boletos_confirmados between 1 and 20),

  respondido_en timestamptz,
  creado_en     timestamptz  not null default now()
);

-- Para bases ya creadas antes de agregar la columna: la añade si falta.
alter table invitados
  add column if not exists boletos_confirmados smallint
  check (boletos_confirmados between 1 and 20);

create index if not exists invitados_creado_en_idx on invitados (creado_en desc);

-- ============================================================================
--  Seguridad
-- ============================================================================
-- RLS activado SIN políticas = la anon key pública no puede leer ni escribir
-- absolutamente nada. Todo el acceso pasa por las funciones de /api, que usan
-- la service_role key (guardada solo en las variables de entorno de Vercel).
-- Esto es lo que evita que alguien pueda descargar la lista de invitados.

alter table invitados enable row level security;

-- Si en algún momento agregas políticas, recuerda que `nombre` es información
-- de control interno y no debería quedar legible para el rol anon.
