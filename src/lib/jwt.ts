// src/lib/jwt.ts
import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('La variable d\'environnement JWT_SECRET n\'est pas définie.');
  }
  return secret;
};

export const signToken = async (payload: { id: string; role: string }) => {
  const secret = new TextEncoder().encode(getJwtSecretKey());
  const alg = 'HS256';

  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d') // Le token expire dans 7 jours
    .sign(secret);
};

export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch (error) {
    return null;
  }
};