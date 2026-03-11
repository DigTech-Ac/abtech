import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'USER' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe requis' }, { status: 400 });
    }

    // 1. Vérifier si l'email est déjà pris
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // 2. Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'utilisateur dans PostgreSQL
    const userRole = role.toUpperCase(); // Prisma attend "USER", "ADMIN", etc.
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole as any,
      }
    });

    // 4. Générer le Token JWT
    const token = await signToken({ id: newUser.id, role: newUser.role });

    const { password: _, ...userWithoutPassword } = newUser;
    const frontendUser = { ...userWithoutPassword, role: newUser.role.toLowerCase() };

    const response = NextResponse.json({
      user: frontendUser,
      message: 'Compte créé avec succès'
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}