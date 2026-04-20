-- ============================================================
--  PAC 22 – Initial schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservations (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  first_name     TEXT        NOT NULL,
  last_name      TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  players_count  INTEGER     NOT NULL CHECK (players_count BETWEEN 2 AND 30),
  date           DATE        NOT NULL,
  start_time     TIME        NOT NULL,
  duration_hours INTEGER     NOT NULL CHECK (duration_hours IN (1, 2, 3, 4)),
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'confirmed', 'refused')),
  refusal_reason TEXT
);

CREATE TABLE IF NOT EXISTS time_slots (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT    NOT NULL CHECK (day_of_week IN ('saturday', 'sunday')),
  start_time  TIME    NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (day_of_week, start_time)
);

-- ── 2. Default time slots ────────────────────────────────────

INSERT INTO time_slots (day_of_week, start_time, is_active) VALUES
  ('saturday', '09:00:00', TRUE),
  ('saturday', '11:00:00', TRUE),
  ('saturday', '13:00:00', TRUE),
  ('saturday', '15:00:00', TRUE),
  ('sunday',   '09:00:00', TRUE),
  ('sunday',   '11:00:00', TRUE),
  ('sunday',   '13:00:00', TRUE),
  ('sunday',   '15:00:00', TRUE)
ON CONFLICT (day_of_week, start_time) DO NOTHING;

-- ── 3. Public availability view ──────────────────────────────
--  Exposes only non-personal columns to anonymous users.
--  The view runs with the definer's privileges (SECURITY DEFINER
--  is the default for views in PostgreSQL), so RLS on the base
--  table is bypassed; only the columns listed here are visible.

CREATE OR REPLACE VIEW public_availability AS
  SELECT id, date, start_time, duration_hours, status
  FROM   reservations
  WHERE  status IN ('pending', 'confirmed');

-- ── 4. Row Level Security ────────────────────────────────────

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots   ENABLE ROW LEVEL SECURITY;

-- reservations: anyone can insert (create a booking)
CREATE POLICY "anon_insert_reservations"
  ON reservations FOR INSERT TO anon
  WITH CHECK (true);

-- reservations: authenticated (admin) can read all
CREATE POLICY "auth_select_reservations"
  ON reservations FOR SELECT TO authenticated
  USING (true);

-- reservations: authenticated can update (confirm / refuse)
CREATE POLICY "auth_update_reservations"
  ON reservations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- reservations: authenticated can delete (optional – for admin cleanup)
CREATE POLICY "auth_delete_reservations"
  ON reservations FOR DELETE TO authenticated
  USING (true);

-- time_slots: anyone can read
CREATE POLICY "anon_select_time_slots"
  ON time_slots FOR SELECT TO anon, authenticated
  USING (true);

-- time_slots: authenticated can manage
CREATE POLICY "auth_manage_time_slots"
  ON time_slots FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── 5. Grants ────────────────────────────────────────────────

-- Allow anon to query the view
GRANT SELECT ON public_availability TO anon;

-- ── 6. Realtime ──────────────────────────────────────────────
-- Enable real-time updates for the admin dashboard.

ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
