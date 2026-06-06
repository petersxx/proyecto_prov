-- Schema para La Provista en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- ── Menú ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS menu_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       text NOT NULL,
  categoria    text NOT NULL,
  subcategoria text,
  descripcion  text DEFAULT '',
  precio       numeric,
  precio_raya  numeric,
  orden        integer DEFAULT 0,
  activo       boolean DEFAULT true,
  foto         text,
  nombre_en    text,
  descripcion_en text,
  nombre_pt    text,
  descripcion_pt text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_items_activo_orden ON menu_items (activo, orden);

-- Lectura pública del menú
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_items_public_read" ON menu_items
  FOR SELECT USING (activo = true);

-- ── Reservas ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservas (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    text NOT NULL,
  mesa      text,
  zona      text DEFAULT 'Salón',
  telefono  text,
  fecha     date NOT NULL,
  hora      text,
  personas  integer DEFAULT 1,
  estado    text DEFAULT 'Pendiente',
  notas     text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reservas_fecha ON reservas (fecha);

-- Solo la service_role_key puede operar reservas (la anon_key no tiene acceso)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
