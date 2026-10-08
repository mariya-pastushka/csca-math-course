import { ipAddress } from '@vercel/functions'
import { handleAccessApi } from '../server/access-api.js'
import { webRequest, sendResponse } from '../server/node-adapter.js'
import { jsonResponse } from '../server/pages.js'

export default async function handler(req,res) {
  try {
    const request = await webRequest(req)
    await sendResponse(res,await handleAccessApi(request,{clientIp:ipAddress(request) || 'unknown'}))
  } catch {
    await sendResponse(res,jsonResponse({error:'Некорректный запрос'},400))
  }
}
