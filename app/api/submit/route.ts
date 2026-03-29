// src/app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialise le client Redis avec tes variables d'environnement
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, telephone, message } = body;

    // Validation simple
    if (!nom || !email || !message) {
      return NextResponse.json({ message: "Les champs Nom, Email et Message sont obligatoires." }, { status: 400 });
    }

    // Crée un objet avec les données du formulaire
    const formData = {
      nom,
      email,
      telephone: telephone || 'Non renseigné', // Met une valeur par défaut si le téléphone est vide
      message,
      date: new Date().toISOString(), // Ajoute la date et l'heure de la soumission
    };

    // Enregistre les données dans Redis
    // On utilise un identifiant unique pour chaque soumission (ex: contact:1234567890)
    await redis.set(`contact:${Date.now()}`, JSON.stringify(formData));

    console.log("Données enregistrées avec succès :", formData);

    return NextResponse.json({ message: "Message reçu et enregistré avec succès !" });

  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans Redis :", error);
    return NextResponse.json({ message: "Erreur serveur lors de l'enregistrement." }, { status: 500 });
  }
}