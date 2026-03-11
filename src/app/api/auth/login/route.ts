import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    // 1. Chercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    // 2. Vérifier que le mot de passe correspond au hash en base
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    // 3. Générer un vrai token JWT
    const token = await signToken({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    // On s'assure que le rôle est en minuscule pour que le frontend (Zustand) le gère bien
    const frontendUser = { ...userWithoutPassword, role: user.role.toLowerCase() };

    const response = NextResponse.json({
      user: frontendUser,
      message: 'Connexion réussie'
    });

    // 4. Mettre le token dans les cookies
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}