export async function requireSiteSession() {
  try {
    const response = await fetch('/api/access?action=status',{credentials:'same-origin',cache:'no-store'})
    const session = response.ok ? await response.json() : null
    if (session?.authorized) return true
  } catch { /* Fail closed if access cannot be verified. */ }
  window.location.replace('/login')
  return false
}
