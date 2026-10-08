import { neon } from '@neondatabase/serverless'

let connection
let schemaReady

export function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  if (!connection) connection = neon(process.env.DATABASE_URL)
  return connection
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = database()
      await sql.query(`CREATE TABLE IF NOT EXISTS site_settings (
        id integer PRIMARY KEY CHECK (id = 1),
        password_hash text,
        password_version bigint NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`)
      await sql.query('INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING')
      await sql.query(`CREATE TABLE IF NOT EXISTS site_auth_sessions (
        token_hash text PRIMARY KEY,
        role text NOT NULL CHECK (role IN ('user', 'admin')),
        password_version bigint,
        admin_fingerprint text,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`)
      await sql.query('CREATE INDEX IF NOT EXISTS site_auth_sessions_expiry_idx ON site_auth_sessions (expires_at)')
      await sql.query(`CREATE TABLE IF NOT EXISTS site_login_limits (
        key_hash text PRIMARY KEY,
        failures integer NOT NULL DEFAULT 0,
        window_started_at timestamptz NOT NULL DEFAULT now()
      )`)
    })().catch((error) => { schemaReady = undefined; throw error })
  }
  await schemaReady
}
