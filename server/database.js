import { neon } from '@neondatabase/serverless'
import { databaseUrl } from './config.js'

let connection
let connectionUrl
let schemaReady

export function database() {
  const url = databaseUrl()
  if (!connection || connectionUrl !== url) {
    connection = neon(url)
    connectionUrl = url
    schemaReady = undefined
  }
  return connection
}

export async function ensureSchema() {
  const sql = database()
  if (!schemaReady) {
    schemaReady = (async () => {
      // On Vercel, each cold start should not repeat DDL on an initialized database.
      const [existing] = await sql`SELECT to_regclass('site_settings') IS NOT NULL AS settings,
        to_regclass('site_auth_sessions') IS NOT NULL AS sessions,
        to_regclass('site_login_limits') IS NOT NULL AS limits`
      if (existing.settings && existing.sessions && existing.limits) {
        const rows = await sql`SELECT id FROM site_settings WHERE id=1`
        if (!rows.length) await sql.query('INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING')
        return
      }
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
