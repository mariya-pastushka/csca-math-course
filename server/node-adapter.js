export async function webRequest(req) {
  const headers = new Headers()
  for (const [key,value] of Object.entries(req.headers)) if (value !== undefined) headers.set(key,Array.isArray(value) ? value.join(', ') : value)
  const protocol = process.env.VERCEL === '1' ? 'https' : 'http'
  const url = `${protocol}://${req.headers.host || 'localhost'}${req.url}`
  let body
  if (!['GET','HEAD'].includes(req.method)) {
    if (req.body !== undefined) body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    else {
      const chunks = []
      let size = 0
      for await (const chunk of req) {
        size += chunk.length
        if (size > 2048) throw new Error('Request body limit')
        chunks.push(chunk)
      }
      body = Buffer.concat(chunks).toString('utf8')
    }
  }
  return new Request(url,{method:req.method,headers,...(body !== undefined ? {body} : {})})
}

export async function sendResponse(res,response) {
  res.statusCode = response.status
  for (const [key,value] of response.headers) res.setHeader(key,value)
  res.end(Buffer.from(await response.arrayBuffer()))
}
