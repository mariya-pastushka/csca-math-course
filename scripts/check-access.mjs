import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

// This integration test intentionally rotates the password in the configured database.
if (!process.argv.includes('--rotate-password')) {
  console.error('Тест меняет пароль и отзывает доступ. Добавьте --rotate-password для явного согласия.')
  process.exit(1)
}
process.loadEnvFile('.env.local')
const base = process.argv.find((arg) => arg.startsWith('--url='))?.slice(6) || 'http://127.0.0.1:5173'
if (!['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw new Error('Используйте только локальный адрес')
const { claimLoginAttempt, clearFailures, currentSettings, generatePassword, hashPassword, sessionCookie, verifyPassword } = await import('../server/auth.js')
const { database } = await import('../server/database.js')
let checks = 0
let adminCookie = ''
let userCookie = ''
let passwordChanged = false
const check = (condition,message) => { assert.ok(condition,message); checks++ }
async function request(path,{method = 'GET',body,cookie = '',origin = base} = {}) {
  return fetch(base + path,{method,redirect:'manual',headers:{...(cookie ? {Cookie:cookie} : {}),...(method === 'POST' ? {Origin:origin,'Content-Type':'application/json'} : {})},...(body !== undefined ? {body:JSON.stringify(body)} : {})})
}
const api = (action,options) => request('/api/access?action=' + action,options)
const post = (action,body,cookie,origin) => api(action,{method:'POST',body,cookie,origin})
const cookieFrom = (response) => response.headers.get('set-cookie')?.split(';')[0] || ''

try {
  for (const path of ['/','/week-1','/week-2','/week-1/whiteboard']) {
    const response = await request(path)
    check(response.status === 303 && response.headers.get('location') === base + '/login','Основные страницы должны требовать вход')
  }
  for (const path of ['/src/main.jsx','/assets/course.js','/index.html','/@vite/client']) {
    check((await request(path)).status === 401,'Ресурсы курса должны быть закрыты без сессии')
  }
  for (const path of ['/.env.local','/server/auth.js','/middleware.js','/@fs/private-file']) {
    check((await request(path)).status === 404,'Серверные файлы не должны публиковаться')
  }
  const loginHtml = await (await request('/login')).text()
  check(loginHtml.includes('Введите пароль') && !loginHtml.includes('/src/main.jsx') && !loginHtml.includes('name="username"'),'Вход ученика должен быть отдельной серверной страницей без логина администратора')
  check((await request('/auth/site.css')).status === 200 && (await request('/auth/access.js')).status === 200,'Стили и скрипт входа должны работать без сессии')
  check((await request('/admin')).status === 303,'Админка должна требовать отдельный вход')
  check((await request('/admin/login')).status === 200,'Вход администратора должен открываться')
  check((await post('admin-login',{username:process.env.ADMIN_USERNAME,password:'incorrect-test-value'})).status === 401,'Неправильный пароль администратора не должен работать')
  const adminLogin = await post('admin-login',{username:process.env.ADMIN_USERNAME,password:process.env.ADMIN_PASSWORD})
  check(adminLogin.status === 200,'Правильные серверные данные администратора должны работать')
  adminCookie = cookieFrom(adminLogin)
  check(Boolean(adminCookie) && /HttpOnly; SameSite=Lax/.test(adminLogin.headers.get('set-cookie')),'Админская cookie должна быть HttpOnly и SameSite=Lax')
  check((await request('/admin',{cookie:adminCookie})).status === 200,'Авторизованный администратор должен открыть админку')
  check((await post('rotate',{},adminCookie,'https://foreign.example')).status === 403,'CSRF-запрос должен быть отклонён')
  check((await post('rotate',{})).status === 401,'Неавторизованный посетитель не может менять пароль')

  const generatedResponse = await post('rotate',{},adminCookie)
  check(generatedResponse.status === 200,'Генерация должна сохранить пароль в Neon')
  passwordChanged = true
  let generated = (await generatedResponse.json()).password
  check(typeof generated === 'string' && /^\d{6}$/.test(generated),'Новый пароль — строка ровно из 6 цифр')
  let settings = await currentSettings()
  check(settings.password_hash !== generated && settings.password_hash.startsWith('scrypt$') && await verifyPassword(generated,settings.password_hash),'В Neon должен сохраняться только корректный scrypt hash')
  check((await post('login',{password:generated.slice(0,5)})).status === 401,'Пять цифр не должны приниматься')
  const wrongPassword = String((Number(generated[0]) + 1) % 10) + generated.slice(1)
  check((await post('login',{password:wrongPassword})).status === 401,'Неправильный пользовательский пароль не должен работать')
  const userLogin = await post('login',{password:generated})
  check(userLogin.status === 200,'Правильный пользовательский пароль должен работать')
  userCookie = cookieFrom(userLogin)
  check(Boolean(userCookie) && /HttpOnly; SameSite=Lax/.test(userLogin.headers.get('set-cookie')),'Пользовательская cookie должна быть HttpOnly и SameSite=Lax')
  for (const path of ['/','/week-1','/week-2','/week-1/whiteboard','/src/main.jsx']) {
    check((await request(path,{cookie:userCookie})).status === 200,'После входа существующий сайт должен открываться')
  }
  check((await request('/admin',{cookie:userCookie})).status === 303,'Обычная пользовательская сессия не должна открывать админку')
  check((await api('settings',{cookie:userCookie})).status === 401,'Обычный пользователь не должен читать настройки админки')
  check((await post('rotate',{},userCookie)).status === 401,'Обычный пользователь не должен менять пароль')

  const rotated = await post('rotate',{},adminCookie)
  check(rotated.status === 200,'Повторная генерация должна работать')
  let newer = (await rotated.json()).password
  check(newer !== generated,'Новый пароль должен отличаться от текущего')
  check((await post('login',{password:generated})).status === 401,'Старый пароль сразу должен перестать работать')
  check((await request('/',{cookie:userCookie})).status === 303,'Старая пользовательская сессия должна быть отозвана')
  check(!(await (await api('status',{cookie:userCookie})).json()).authorized,'API должен подтверждать отзыв старой сессии')
  check((await post('login',{password:newer})).status === 200,'Новый пароль должен работать')
  generated = newer = ''

  // Temporary random leading-zero fixture; removed by the final server-side rotation below.
  let zeroPassword = '0' + generatePassword().slice(1)
  const zeroHash = await hashPassword(zeroPassword)
  await database()`UPDATE site_settings SET password_hash=${zeroHash},password_version=password_version+1,updated_at=now() WHERE id=1`
  check((await post('login',{password:zeroPassword})).status === 200,'Пароль с ведущим нулём должен работать через HTTP')
  check(!await verifyPassword(zeroPassword.slice(1),zeroHash),'Потеря ведущего нуля должна делать пароль неверным')
  zeroPassword = ''
  const samples = Array.from({length:1000},generatePassword)
  check(samples.every((value) => typeof value === 'string' && /^\d{6}$/.test(value)) && samples.some((value) => value.startsWith('0')),'Генератор должен сохранять ведущие нули')

  const testIp = 'integration-' + randomUUID()
  try {
    const attempts = await Promise.all(Array.from({length:16},() => claimLoginAttempt('user',testIp)))
    check(attempts.filter(Boolean).length === 12,'Ограничение попыток должно работать и при параллельном переборе')
  } finally { await clearFailures('user',testIp) }
  const previousVercel = process.env.VERCEL
  process.env.VERCEL = '1'
  try {
    check(sessionCookie('user','test-token').includes('__Host-csca_access=') && sessionCookie('user','test-token').includes('; Secure'),'Production cookie должна иметь Secure и защищённое имя')
    const { default:middleware } = await import('../middleware.js')
    const { handleAccessApi } = await import('../server/access-api.js')
    const { deleteSession } = await import('../server/auth.js')
    check((await middleware(new Request('https://site.example/week-2'))).status === 303,'Vercel middleware должен защищать прямые страницы')
    check((await middleware(new Request('https://site.example/assets/index.js'))).status === 401,'Vercel middleware должен защищать сборку курса')
    const response = await handleAccessApi(new Request('https://site.example/api/access?action=admin-login',{
      method:'POST',headers:{Origin:'https://site.example','Content-Type':'application/json'},
      body:JSON.stringify({username:process.env.ADMIN_USERNAME,password:process.env.ADMIN_PASSWORD}),
    }),{clientIp:'production-check'})
    check(response.status === 200 && response.headers.get('set-cookie').includes('; Secure'),'Production API должен выдавать защищённую cookie')
    const productionRequest = new Request('https://site.example/week-2',{headers:{Cookie:cookieFrom(response)}})
    try {
      const allowed = await middleware(productionRequest)
      check(allowed.headers.get('x-middleware-next') === '1' && allowed.headers.get('cache-control').includes('no-store'),'Vercel middleware должен пропускать только проверенную сессию без публичного кеширования')
    } finally { await deleteSession(productionRequest,'admin') }
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL
    else process.env.VERCEL = previousVercel
  }

  const ignored = execFileSync('git',['check-ignore','.env.local'],{encoding:'utf8'}).trim()
  check(ignored === '.env.local','Файл с секретами должен быть игнорируемым')
  const tracked = execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/)
  // The username is also the existing public Telegram handle, not a secret.
  const secrets = ['DATABASE_URL','ADMIN_PASSWORD'].map((key) => process.env[key]).filter(Boolean)
  for (const path of tracked) {
    const contents = await readFile(path)
    check(!secrets.some((secret) => contents.includes(Buffer.from(secret))),'В доступных для Git файлах обнаружен секрет: ' + path)
  }
  async function scanBuild(dir) {
    for (const item of await readdir(dir,{withFileTypes:true})) {
      const path = dir + '/' + item.name
      if (item.isDirectory()) await scanBuild(path)
      else {
        const contents = await readFile(path)
        check(!secrets.some((secret) => contents.includes(Buffer.from(secret))),'Секрет не должен попадать в сборку')
      }
    }
  }
  await scanBuild('dist')
  console.log(`Проверки защиты пройдены: ${checks}. Секреты и пароли в вывод не включены.`)
} finally {
  if (adminCookie) {
    if (passwordChanged) {
      const finalRotation = await post('rotate',{},adminCookie)
      if (finalRotation.status !== 200) throw new Error('Не удалось убрать тестовый пароль. Сгенерируйте новый через /admin.')
      console.log('Тестовый пароль удалён. Перед использованием сгенерируйте свой новый пароль в /admin.')
    }
    await post('admin-logout',{},adminCookie)
  }
}
