import { claimLoginAttempt, clearFailures, createSession, currentSettings, deleteSession, rotatePassword, safeEqual, sessionCookie, validSession, verifyPassword } from './auth.js'
import { jsonResponse } from './pages.js'
import { adminCredentials, databaseUrl } from './config.js'
import { accessFailure } from './access-errors.js'

export async function handleAccessApi(request,{ clientIp = 'unknown' } = {}) {
  const action = new URL(request.url).searchParams.get('action')
  let stage = 'request'
  try {
    if (request.method === 'GET' && action === 'status') {
      stage = 'session-check'
      const admin = await validSession(request,'admin')
      return jsonResponse({authorized:admin || await validSession(request,'user'),admin})
    }
    if (request.method === 'GET' && action === 'settings') {
      stage = 'settings'
      if (!await validSession(request,'admin')) return jsonResponse({error:'Требуется вход администратора'},401)
      const settings = await currentSettings()
      return jsonResponse({configured:Boolean(settings.password_hash),updatedAt:settings.updated_at})
    }
    if (request.method !== 'POST') return jsonResponse({error:'Метод не поддерживается'},405,{Allow:'POST'})
    const origin = request.headers.get('origin')
    if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return jsonResponse({error:'Недопустимый запрос'},403)
    if (!request.headers.get('content-type')?.startsWith('application/json')) return jsonResponse({error:'Требуется JSON'},415)
    if (!['login','admin-login','rotate','logout','admin-logout'].includes(action)) return jsonResponse({error:'Неизвестное действие'},404)

    let body
    try {
      const raw = await request.text()
      if (Buffer.byteLength(raw) > 2048) return jsonResponse({error:'Запрос слишком большой'},413)
      body = JSON.parse(raw)
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body')
    } catch { return jsonResponse({error:'Некорректный запрос'},400) }

    if (action === 'rotate') {
      stage = 'password-rotate'
      if (!await validSession(request,'admin')) return jsonResponse({error:'Требуется вход администратора'},401)
      return jsonResponse({password:await rotatePassword()})
    }
    if (action === 'logout' || action === 'admin-logout') {
      stage = 'logout'
      const role = action === 'logout' ? 'user' : 'admin'
      await deleteSession(request,role)
      return jsonResponse({ok:true},200,{'Set-Cookie':sessionCookie(role,'',true)})
    }

    const role = action === 'admin-login' ? 'admin' : 'user'
    stage = 'configuration'
    const credentials = role === 'admin' ? adminCredentials() : null
    databaseUrl()
    stage = 'login-limit'
    if (!await claimLoginAttempt(role,clientIp)) return jsonResponse({error:'Слишком много попыток. Попробуйте через 15 минут.'},429,{'Retry-After':'900'})
    let correct = false
    let settings
    if (role === 'admin') {
      correct = typeof body.username === 'string' && typeof body.password === 'string'
        && body.username.length <= 128 && body.password.length <= 128
        && safeEqual(body.username,credentials.username) && safeEqual(body.password,credentials.password)
    } else {
      stage = 'password-check'
      settings = await currentSettings()
      correct = await verifyPassword(body.password,settings.password_hash)
    }
    if (!correct) {
      return jsonResponse({error:role === 'admin' ? 'Неверный логин или пароль' : 'Неверный пароль'},401)
    }
    stage = 'session-create'
    const token = await createSession(role,settings?.password_version)
    if (!token) return jsonResponse({error:'Пароль изменён. Введите новый пароль.'},401)
    stage = 'login-limit-clear'
    await clearFailures(role,clientIp)
    return jsonResponse({ok:true},200,{'Set-Cookie':sessionCookie(role,token)})
  } catch (error) {
    return accessFailure(error,{stage,action})
  }
}
