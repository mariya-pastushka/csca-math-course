import { next } from '@vercel/functions'
import { protectRequest } from './server/protect.js'
import { securityHeaders } from './server/pages.js'

export const config = { matcher:'/:path*', runtime:'nodejs' }

export default async function middleware(request) {
  return await protectRequest(request) || next({headers:securityHeaders})
}
