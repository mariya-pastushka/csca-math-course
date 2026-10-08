export const securityHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Vercel-CDN-Cache-Control': 'no-store',
  'CDN-Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
}

export function accessPage(mode) {
  const adminLogin = mode === 'admin-login'
  const admin = mode === 'admin'
  const title = admin ? 'Управление доступом' : adminLogin ? 'Вход администратора' : 'Доступ к сайту'
  const content = admin ? `
    <p class="access-description">Измените пароль для входа на учебную платформу.</p>
    <div class="access-current"><span>Текущий пароль</span><strong>••••••</strong><small id="password-status">Загрузка…</small></div>
    <button id="generate-password" class="primary-button access-submit" type="button">Сгенерировать новый пароль</button>
    <div id="new-password-panel" class="access-new-password" hidden><span>Новый пароль</span><output id="new-password"></output><button id="copy-password" class="secondary-button" type="button">Скопировать</button><small>Сохраните пароль: после закрытия страницы он больше не показывается.</small></div>
    <p class="access-note">После смены пароля пользователи войдут заново.</p>
    <div class="access-admin-actions"><a class="text-button" href="/">Открыть сайт</a><button id="admin-logout" class="text-button" type="button">Выйти из админки</button></div>` : `
    <p class="access-description">${adminLogin ? 'Введите логин и пароль администратора' : 'Введите пароль'}</p>
    <form id="access-form" novalidate>
      ${adminLogin ? '<label class="access-field"><span>Логин</span><input id="username" name="username" type="text" autocomplete="username" maxlength="128" required /></label>' : ''}
      <label class="access-field"><span>${adminLogin ? 'Пароль' : '6 цифр'}</span><input id="password" name="password" type="password" ${adminLogin ? 'autocomplete="current-password" maxlength="128"' : 'class="access-pin" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="off"'} required autofocus /></label>
      <button class="primary-button access-submit" type="submit">Войти</button>
    </form>`
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#10120f"><title>${title} · CSCA Mathematics</title><link rel="stylesheet" href="/auth/site.css"><script src="/auth/access.js" defer></script></head><body><main class="page access-page" data-access-mode="${mode}"><div class="access-brand"><span class="brand-mark">C</span><span>CSCA / MATH</span></div><section class="access-card reveal reveal-one"><div class="access-lock" aria-hidden="true">🔐</div><h1>${title}</h1>${content}<p id="access-error" class="access-error" role="alert" hidden></p><p id="access-message" class="access-message" aria-live="polite"></p></section></main></body></html>`
}

export function htmlResponse(mode) {
  return new Response(accessPage(mode),{headers:{...securityHeaders,'Content-Type':'text/html; charset=utf-8',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"}})
}

export const jsonResponse = (data,status = 200,extraHeaders = {}) => new Response(JSON.stringify(data),{status,headers:{...securityHeaders,'Content-Type':'application/json; charset=utf-8',...extraHeaders}})

export function accessRedirect(request,path) {
  return new Response(null,{status:303,headers:{...securityHeaders,Location:new URL(path,request.url).href}})
}
