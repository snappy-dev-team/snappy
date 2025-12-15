import { NextResponse, type NextRequest } from 'next/server'

const unauthorized = () =>
  new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminPath) return NextResponse.next()

  const adminUser = process.env.ADMIN_BASIC_USER
  const adminPass = process.env.ADMIN_BASIC_PASS

  // In production, require credentials to be set; in development allow missing creds for local ease.
  if (!adminUser || !adminPass) {
    if (process.env.NODE_ENV === 'development') return NextResponse.next()
    return new NextResponse('Admin auth not configured', { status: 500 })
  }

  const header = req.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return unauthorized()

  const decoded = Buffer.from(header.replace('Basic ', ''), 'base64').toString()
  const [user, pass] = decoded.split(':')
  if (user !== adminUser || pass !== adminPass) return unauthorized()

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
