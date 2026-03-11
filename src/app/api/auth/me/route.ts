import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 1. Vérifier la validité du Token JWT
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    // 2. Récupérer l'utilisateur depuis PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    const frontendUser = { ...userWithoutPassword, role: user.role.toLowerCase() };

    return NextResponse.json({ user: frontendUser });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}