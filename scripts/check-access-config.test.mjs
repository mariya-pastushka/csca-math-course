import assert from 'node:assert/strict'
import { test } from 'node:test'
import { adminCredentials, databaseUrl, readServerSetting } from '../server/config.js'
import { accessFailure, classifyAccessError } from '../server/access-errors.js'
import { handleAccessApi } from '../server/access-api.js'
import { protectRequest } from '../server/protect.js'

const fakeUrl = 'postgresql://test_user:test_only_password@sample.neon.tech/test_db?sslmode=require'

test('Students enter only a six-digit password; admin login remains separate',async () => {
  const homepage = await protectRequest(new Request('https://site.example/'))
  assert.equal(homepage.status,303)
  assert.equal(homepage.headers.get('location'),'https://site.example/login')
  const student = await protectRequest(new Request('https://site.example/login'))
  const studentHtml = await student.text()
  assert.ok(studentHtml.includes('<h1>Введите пароль</h1>'))
  assert.ok(studentHtml.includes('пароль из 6 цифр'))
  assert.ok(studentHtml.includes('maxlength="6"'))
  assert.ok(studentHtml.includes('pattern="[0-9]{6}"'))
  assert.ok(!studentHtml.includes('name="username"'))
  assert.ok(!studentHtml.includes('Вход администратора'))
  const administrator = await protectRequest(new Request('https://site.example/admin/login'))
  const adminHtml = await administrator.text()
  assert.ok(adminHtml.includes('<h1>Вход администратора</h1>'))
  assert.ok(adminHtml.includes('name="username"'))
})

async function withEnv(values,work) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key,process.env[key]]))
  for (const [key,value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  try { return await work() }
  finally {
    for (const [key,value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

test('Neon setting accepts plain, quoted and pasted dotenv values',async () => {
  for (const value of [fakeUrl,'  ' + fakeUrl + '\n',"'" + fakeUrl + "'",'"' + fakeUrl + '"',"DATABASE_URL='" + fakeUrl + "'","DATABASE_URL = '" + fakeUrl + "'"]) {
    await withEnv({DATABASE_URL:value},() => assert.equal(databaseUrl(),fakeUrl))
  }
})

test('Admin settings remain strings and preserve a leading zero',async () => {
  await withEnv({ADMIN_USERNAME:'  test-admin  ',ADMIN_PASSWORD:"ADMIN_PASSWORD='005281'"},() => {
    const credentials = adminCredentials()
    assert.equal(credentials.username,'test-admin')
    assert.equal(credentials.password,'005281')
    assert.equal(typeof credentials.password,'string')
  })
})

test('Missing and invalid settings have safe, specific error codes',async () => {
  for (const value of [undefined,'','  ']) {
    await withEnv({DATABASE_URL:value},() => assert.throws(databaseUrl,{code:'MISSING_DATABASE_URL'}))
  }
  for (const value of ['https://example.com/db','not-a-url','postgresql://user:private-password@/db']) {
    await withEnv({DATABASE_URL:value},() => {
      let caught
      try { databaseUrl() } catch (error) { caught = error }
      assert.equal(caught.code,'INVALID_DATABASE_URL')
      assert.ok(!caught.message.includes(value))
    })
  }
  await withEnv({ADMIN_PASSWORD:undefined},() => assert.throws(() => readServerSetting('ADMIN_PASSWORD'),{code:'MISSING_ADMIN_PASSWORD'}))
})

test('Driver errors are classified without returning the original message',() => {
  assert.equal(classifyAccessError({code:'28P01'},'login-limit'),'DATABASE_CREDENTIALS')
  assert.equal(classifyAccessError({code:'42501'},'schema'),'DATABASE_PERMISSIONS')
  assert.equal(classifyAccessError({code:'3D000'},'schema'),'DATABASE_NOT_FOUND')
  assert.equal(classifyAccessError(new Error('fetch failed'),'login-limit'),'DATABASE_NETWORK')
  assert.equal(classifyAccessError(new Error('arbitrary internal detail'),'session-create'),'DATABASE_UNAVAILABLE')
})

test('Logs and API failure bodies contain neither secrets nor untrusted text',async () => {
  const logs = []
  const originalError = console.error
  console.error = (entry) => logs.push(entry)
  try {
    const response = accessFailure(new Error('Connection failed: ' + fakeUrl),{stage:'login-limit',action:fakeUrl})
    const body = await response.json()
    assert.equal(response.status,503)
    assert.equal(body.code,'DATABASE_UNAVAILABLE')
    assert.equal(response.headers.get('x-request-id'),body.requestId)
    assert.ok(!JSON.stringify(body).includes('test_only_password'))
    assert.ok(!logs.join('').includes(fakeUrl))
    assert.ok(!logs.join('').includes('test_only_password'))
    assert.equal(JSON.parse(logs[0]).action,'unknown')
    assert.equal(JSON.parse(logs[0]).stage,'login-limit')
  } finally { console.error = originalError }
})

test('Login fails closed with a clear missing-DB response, before a network request',async () => {
  const originalError = console.error
  console.error = () => {}
  try {
    await withEnv({DATABASE_URL:undefined,ADMIN_USERNAME:'test-admin',ADMIN_PASSWORD:'005281'},async () => {
      const response = await handleAccessApi(new Request('https://site.example/api/access?action=admin-login',{
        method:'POST',headers:{Origin:'https://site.example','Content-Type':'application/json'},
        body:JSON.stringify({username:'test-admin',password:'005281'}),
      }))
      assert.equal(response.status,503)
      assert.equal(response.headers.get('set-cookie'),null)
      const body = await response.json()
      assert.equal(body.code,'MISSING_DATABASE_URL')
      assert.ok(body.error.includes('DATABASE_URL'))
      assert.ok(!JSON.stringify(body).includes('005281'))
    })
  } finally { console.error = originalError }
})

test('Missing admin setting and invalid URL do not get hidden behind a generic error',async () => {
  const originalError = console.error
  console.error = () => {}
  const login = () => new Request('https://site.example/api/access?action=admin-login',{
    method:'POST',headers:{Origin:'https://site.example','Content-Type':'application/json'},body:JSON.stringify({username:'test-admin',password:'005281'}),
  })
  try {
    await withEnv({DATABASE_URL:fakeUrl,ADMIN_USERNAME:'test-admin',ADMIN_PASSWORD:undefined},async () => {
      const response = await handleAccessApi(login())
      assert.equal((await response.json()).code,'MISSING_ADMIN_PASSWORD')
    })
    await withEnv({DATABASE_URL:'wrong-value',ADMIN_USERNAME:'test-admin',ADMIN_PASSWORD:'005281'},async () => {
      const response = await handleAccessApi(login())
      assert.equal((await response.json()).code,'INVALID_DATABASE_URL')
      assert.equal(response.headers.get('set-cookie'),null)
    })
  } finally { console.error = originalError }
})
