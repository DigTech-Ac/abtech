import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPage = pathname.startsWith('/admin');
  const isDashboardPage = pathname.startsWith('/dashboard-etudiant');

  // 1. Redirection vers login si accès à une zone protégée sans token
  if (!token && (isAdminPage || isDashboardPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Si un token est présent, on vérifie sa validité et le rôle
  if (token) {
    const payload = await verifyToken(token);

    if (!payload) {
      // Token invalide ou expiré
      if (isAdminPage || isDashboardPage) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
    } else {
      // L'utilisateur est authentifié et le token est valide
      const userRole = payload.role as string;

      // Si un utilisateur connecté tente d'aller sur login/register, on le redirige là où il doit être
      if (isAuthPage) {
        if (userRole === 'ADMIN' || userRole === 'MODERATOR') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard-etudiant', request.url));
        }
      }

      // PROTECTION : Si un utilisateur non-admin tente d'accéder à /admin
     const upperRole = userRole.toUpperCase();
if (isAdminPage && upperRole !== 'ADMIN' && upperRole !== 'MODERATOR') {
    return NextResponse.redirect(new URL('/dashboard-etudiant', request.url));
}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard-etudiant/:path*', '/login', '/register'],
};
