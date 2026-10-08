// Server-only configuration. Never import this module into the browser bundle.
export class AccessConfigurationError extends Error {
  constructor(code) {
    super(code)
    this.name = 'AccessConfigurationError'
    this.code = code
  }
}

export function readServerSetting(name,{ required = true } = {}) {
  let value = String(process.env[name] || '').trim()
  // Accept a pasted dotenv line as well as a plain value from the Vercel form.
  const assignment = new RegExp('^' + name + '\\s*=\\s*')
  value = value.replace(assignment,'')
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.at(-1) === quote) value = value.slice(1,-1).trim()
  if (required && !value) throw new AccessConfigurationError('MISSING_' + name)
  return value
}

export function databaseUrl() {
  const value = readServerSetting('DATABASE_URL')
  try {
    const url = new URL(value)
    if (!['postgres:','postgresql:'].includes(url.protocol) || !url.hostname || !url.username || !url.pathname.slice(1) || /\s/.test(value)) throw new Error('Invalid connection format')
  } catch {
    // A URL parser's original error may include the connection password.
    throw new AccessConfigurationError('INVALID_DATABASE_URL')
  }
  return value
}

export const adminCredentials = (required = true) => ({
  username:readServerSetting('ADMIN_USERNAME',{required}),
  password:readServerSetting('ADMIN_PASSWORD',{required}),
})
