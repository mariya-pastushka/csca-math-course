import { validSession } from './auth.js'
import { accessRedirect, htmlResponse, jsonResponse } from './pages.js'

const publicAssets = new Set(['/auth/site.css','/auth/access.js'])
export const isAccessApi = (path) => path === '/api/access' || path === '/api/access/'

export async function protectRequest(request) {
  const path = new URL(request.url).pathname
  if (publicAssets.has(path) || isAccessApi(path)) return null
  if (path === '/login' || path === '/login/') return htmlResponse('user-login')
  if (path === '/admin/login' || path === '/admin/login/') return htmlResponse('admin-login')
  // These are server/source files, never public resources, even after a user logs in.
  if (/^\/(?:\.env|\.git|\.vercel|server(?:\/|$)|scripts(?:\/|$)|api(?:\/|$)|@fs(?:\/|$)|middleware\.js|vite\.config\.js|package(?:-lock)?\.json)/i.test(path)) return new Response('Not found',{status:404})
  try {
    if (path === '/admin' || path.startsWith('/admin/')) {
      if (!await validSession(request,'admin')) return accessRedirect(request,'/admin/login')
      return path === '/admin' || path === '/admin/' ? htmlResponse('admin') : new Response('Not found',{status:404})
    }
    if (await validSession(request,'user') || await validSession(request,'admin')) return null
    const isResource = /\.[a-z\d]+$/i.test(path) || path.startsWith('/src/') || path.startsWith('/@') || path.startsWith('/node_modules/')
    return isResource ? jsonResponse({error:'Требуется вход'},401) : accessRedirect(request,'/login')
  } catch {
    return jsonResponse({error:'Сервис доступа временно недоступен'},503)
  }
}
