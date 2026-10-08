const mode = document.querySelector('[data-access-mode]').dataset.accessMode
const errorElement = document.getElementById('access-error')
const messageElement = document.getElementById('access-message')
const error = (message = '') => { errorElement.textContent = message; errorElement.hidden = !message }

async function api(action,payload) {
  const response = await fetch('/api/access?action=' + action,{
    method:payload === undefined ? 'GET' : 'POST',credentials:'same-origin',cache:'no-store',
    ...(payload === undefined ? {} : {headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),
  })
  if (payload?.password) payload.password = ''
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Не удалось выполнить запрос')
  return data
}

const form = document.getElementById('access-form')
if (form) {
  const password = document.getElementById('password')
  if (mode === 'user-login') password.addEventListener('input',() => { password.value = password.value.replace(/\D/g,'').slice(0,6) })
  form.addEventListener('submit',async (event) => {
    event.preventDefault()
    error()
    const button = form.querySelector('button')
    if (mode === 'user-login' && !/^\d{6}$/.test(password.value)) return error('Введите пароль из 6 цифр')
    const payload = {password:password.value,...(mode === 'admin-login' ? {username:document.getElementById('username').value} : {})}
    password.value = ''
    button.disabled = true
    try {
      await api(mode === 'admin-login' ? 'admin-login' : 'login',payload)
      form.reset()
      location.replace(mode === 'admin-login' ? '/admin' : '/')
    } catch (failure) { error(failure.message); password.focus() }
    finally { payload.password = ''; button.disabled = false }
  })
}

if (mode === 'admin') {
  const generate = document.getElementById('generate-password')
  const output = document.getElementById('new-password')
  const copy = document.getElementById('copy-password')
  api('settings').then((settings) => {
    document.getElementById('password-status').textContent = settings.configured ? 'Пароль установлен' : 'Сначала сгенерируйте пароль для пользователей'
  }).catch((failure) => error(failure.message))
  generate.addEventListener('click',async () => {
    error()
    messageElement.textContent = ''
    generate.disabled = true
    try {
      const result = await api('rotate',{})
      output.textContent = result.password
      document.getElementById('new-password-panel').hidden = false
      document.getElementById('password-status').textContent = 'Пароль установлен'
      messageElement.textContent = 'Пароль обновлён. Старый пароль больше не действует.'
      copy.textContent = 'Скопировать'
    } catch (failure) { error(failure.message) }
    finally { generate.disabled = false }
  })
  copy.addEventListener('click',async () => {
    try { await navigator.clipboard.writeText(output.textContent); copy.textContent = 'Скопировано' }
    catch { error('Выделите и скопируйте пароль вручную') }
  })
  document.getElementById('admin-logout').addEventListener('click',async () => {
    try { await api('admin-logout',{}); output.textContent = ''; location.replace('/admin/login') }
    catch (failure) { error(failure.message) }
  })
}
