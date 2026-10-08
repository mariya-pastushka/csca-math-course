import { randomUUID } from 'node:crypto'
import { AccessConfigurationError } from './config.js'
import { jsonResponse } from './pages.js'

const messages = {
  MISSING_DATABASE_URL:'На сервере не задан DATABASE_URL. Сохраните его для Production в Vercel и выполните Redeploy.',
  INVALID_DATABASE_URL:'Не удалось прочитать DATABASE_URL. Проверьте строку подключения Neon в настройках Vercel.',
  MISSING_ADMIN_USERNAME:'На сервере не задан ADMIN_USERNAME для входа администратора.',
  MISSING_ADMIN_PASSWORD:'На сервере не задан ADMIN_PASSWORD для входа администратора.',
  DATABASE_CREDENTIALS:'Neon отклонил подключение. Проверьте актуальность пароля базы в DATABASE_URL.',
  DATABASE_NOT_FOUND:'Не удалось найти базу из DATABASE_URL. Проверьте подключение к нужной базе Neon.',
  DATABASE_PERMISSIONS:'Подключение к Neon не имеет необходимых прав на таблицы доступа.',
  DATABASE_NETWORK:'Не удалось связаться с Neon. Попробуйте войти ещё раз.',
  DATABASE_UNAVAILABLE:'Не удалось выполнить запрос к Neon. Причина записана в серверный журнал Vercel.',
  ACCESS_UNAVAILABLE:'Не удалось завершить вход. Причина записана в серверный журнал Vercel.',
}

const databaseStages = new Set(['schema','login-limit','password-check','session-create','session-check','settings','password-rotate','logout','login-limit-clear'])
const safeActions = new Set(['status','settings','login','admin-login','rotate','logout','admin-logout'])

export function classifyAccessError(error,stage) {
  if (error instanceof AccessConfigurationError && Object.hasOwn(messages,error.code)) return error.code
  if (error?.code === '28P01' || error?.code === '28000') return 'DATABASE_CREDENTIALS'
  if (error?.code === '3D000') return 'DATABASE_NOT_FOUND'
  if (error?.code === '42501') return 'DATABASE_PERMISSIONS'
  // Read error text only to classify it; never log or return the original text.
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''
  if (['ECONNRESET','ECONNREFUSED','ENOTFOUND','ETIMEDOUT'].includes(error?.code)
    || message.includes('fetch failed') || message.includes('error connecting to database')
    || error?.name === 'TimeoutError' || error?.name === 'AbortError') return 'DATABASE_NETWORK'
  return databaseStages.has(stage) ? 'DATABASE_UNAVAILABLE' : 'ACCESS_UNAVAILABLE'
}

export function accessFailure(error,{stage = 'request',action} = {}) {
  const code = classifyAccessError(error,stage)
  const requestId = randomUUID()
  // Do not print stack/message/cause, URL, username, password, cookies or tokens.
  console.error(JSON.stringify({
    event:'csca_access_failure',requestId,code,
    stage:databaseStages.has(stage) || stage === 'configuration' ? stage : 'request',
    action:safeActions.has(action) ? action : 'unknown',
    postgresCode:/^[0-9A-Z]{5}$/.test(error?.code || '') ? error.code : undefined,
    environment:['production','preview','development'].includes(process.env.VERCEL_ENV) ? process.env.VERCEL_ENV : 'local',
    configured:Object.fromEntries(['DATABASE_URL','ADMIN_USERNAME','ADMIN_PASSWORD'].map((key) => [key,Boolean(process.env[key]?.trim())])),
  }))
  return jsonResponse({error:messages[code],code,requestId},503,{'X-Request-Id':requestId})
}
