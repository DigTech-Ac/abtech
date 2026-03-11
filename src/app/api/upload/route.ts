// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier fourni" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nettoyer le nom du fichier et ajouter un identifiant unique pour éviter les doublons
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${uuidv4()}-${originalName}`;
    
    // Chemin de sauvegarde dans le dossier public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, uniqueFilename);

    // Écrire le fichier sur le disque
    await writeFile(filepath, buffer);

    // Retourner l'URL publique de l'image
    const fileUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ success: false, error: "Échec de l'upload" }, { status: 500 });
  }
}
