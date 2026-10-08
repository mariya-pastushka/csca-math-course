import { readFile } from 'node:fs/promises'
import { handleAccessApi } from './access-api.js'
import { protectRequest, isAccessApi } from './protect.js'
import { webRequest, sendResponse } from './node-adapter.js'
import { jsonResponse, securityHeaders } from './pages.js'

const stylesPath = new URL('../src/styles.css',import.meta.url)

export function accessProtectionPlugin() {
  const configure = (server) => {
    server.middlewares.use(async (req,res,next) => {
      try {
        const request = await webRequest(req)
        const path = new URL(request.url).pathname
        if (path === '/auth/site.css') {
          return sendResponse(res,new Response(await readFile(stylesPath,'utf8'),{headers:{...securityHeaders,'Content-Type':'text/css; charset=utf-8'}}))
        }
        if (isAccessApi(path)) return sendResponse(res,await handleAccessApi(request,{clientIp:req.socket.remoteAddress || 'local'}))
        const blocked = await protectRequest(request)
        if (blocked) return sendResponse(res,blocked)
        for (const [key,value] of Object.entries(securityHeaders)) res.setHeader(key,value)
        next()
      } catch { await sendResponse(res,jsonResponse({error:'Сервис доступа временно недоступен'},503)) }
    })
  }
  return {
    name:'csca-server-access',
    configureServer:configure,
    configurePreviewServer:configure,
    async generateBundle() {
      this.emitFile({type:'asset',fileName:'auth/site.css',source:await readFile(stylesPath,'utf8')})
    },
  }
}
