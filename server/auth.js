import { createHash, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { database, ensureSchema } from './database.js'

const scrypt = promisify(scryptCallback)
const userLifetime = 7 * 24 * 60 * 60
const adminLifetime = 8 * 60 * 60
const production = () => process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
export const cookieName = (role) => (production() ? '__Host-' : '') + (role === 'admin' ? 'csca_admin' : 'csca_access')
const digest = (value) => createHash('sha256').update(value).digest('hex')
const adminFingerprint = () => digest((process.env.ADMIN_USERNAME || '') + '\0' + (process.env.ADMIN_PASSWORD || ''))

export function safeEqual(left, right) {
  return timingSafeEqual(createHash('sha256').update(String(left)).digest(),createHash('sha256').update(String(right)).digest())
}

export const generatePassword = () => Array.from({ length: 6 }, () => String(randomInt(0,10))).join('')

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password,salt,64)
  return 'scrypt$' + salt + '$' + hash.toString('hex')
}

export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || !/^\d{6}$/.test(password) || !stored) return false
  const [algorithm,salt,hash] = stored.split('$')
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(hash)) return false
  const computed = await scrypt(password,salt,64)
  return timingSafeEqual(computed,Buffer.from(hash,'hex'))
}

export function readCookie(request, role) {
  const prefix = cookieName(role) + '='
  const cookie = (request.headers.get('cookie') || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix))
  const token = cookie?.slice(prefix.length)
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null
}

export function sessionCookie(role, token, clear = false) {
  const lifetime = clear ? 0 : role === 'admin' ? adminLifetime : userLifetime
  return `${cookieName(role)}=${clear ? '' : token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${lifetime}${production() ? '; Secure' : ''}`
}

export async function validSession(request, role) {
  const token = readCookie(request,role)
  if (!token) return false
  await ensureSchema()
  const sql = database()
  const rows = await sql`SELECT s.role FROM site_auth_sessions s
    LEFT JOIN site_settings settings ON settings.id=1
    WHERE s.token_hash=${digest(token)} AND s.role=${role} AND s.expires_at>now()
    AND ((s.role='user' AND s.password_version=settings.password_version)
      OR (s.role='admin' AND s.admin_fingerprint=${adminFingerprint()})) LIMIT 1`
  return rows.length === 1
}

export async function createSession(role, passwordVersion) {
  await ensureSchema()
  const sql = database()
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + (role === 'admin' ? adminLifetime : userLifetime) * 1000).toISOString()
  if (role === 'user') {
    // A rotation between password verification and insertion must not create a stale session.
    const rows = await sql`INSERT INTO site_auth_sessions (token_hash,role,password_version,expires_at)
      SELECT ${digest(token)},'user',password_version,${expires}::timestamptz FROM site_settings
      WHERE id=1 AND password_version=${passwordVersion} RETURNING token_hash`
    if (!rows.length) return null
  } else {
    await sql`INSERT INTO site_auth_sessions (token_hash,role,admin_fingerprint,expires_at)
      VALUES (${digest(token)},'admin',${adminFingerprint()},${expires}::timestamptz)`
  }
  return token
}

export async function deleteSession(request,role) {
  const token = readCookie(request,role)
  if (token) {
    await ensureSchema()
    await database()`DELETE FROM site_auth_sessions WHERE token_hash=${digest(token)} AND role=${role}`
  }
}

export async function currentSettings() {
  await ensureSchema()
  const [row] = await database()`SELECT password_hash,password_version,updated_at FROM site_settings WHERE id=1`
  return row
}

export async function rotatePassword() {
  // Compare the version as well, so simultaneous rotations cannot reuse the current password.
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await currentSettings()
    let password = generatePassword()
    while (await verifyPassword(password,current.password_hash)) password = generatePassword()
    const hash = await hashPassword(password)
    const sql = database()
    const [updated] = await sql.transaction([
      sql`UPDATE site_settings SET password_hash=${hash},password_version=password_version+1,updated_at=now()
        WHERE id=1 AND password_version=${current.password_version} RETURNING password_version`,
      sql`DELETE FROM site_auth_sessions WHERE (role='user' AND password_version<
        (SELECT password_version FROM site_settings WHERE id=1)) OR expires_at<=now()`,
    ])
    if (updated.length) return password
  }
  throw new Error('Concurrent password rotation')
}

const limitKey = (role,ip) => digest(role + ':' + ip)
export async function claimLoginAttempt(role,ip) {
  await ensureSchema()
  // Reserve the attempt atomically before checking a password, including concurrent requests.
  const [row] = await database()`INSERT INTO site_login_limits (key_hash,failures) VALUES (${limitKey(role,ip)},1)
    ON CONFLICT (key_hash) DO UPDATE SET
    failures=CASE WHEN site_login_limits.window_started_at<now()-interval '15 minutes' THEN 1 ELSE site_login_limits.failures+1 END,
    window_started_at=CASE WHEN site_login_limits.window_started_at<now()-interval '15 minutes' THEN now() ELSE site_login_limits.window_started_at END
    RETURNING failures`
  return row.failures <= (role === 'admin' ? 6 : 12)
}

export async function clearFailures(role,ip) {
  await database()`DELETE FROM site_login_limits WHERE key_hash=${limitKey(role,ip)}`
}
