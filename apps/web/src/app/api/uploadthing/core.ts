import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Définition de nos règles d'upload
export const ourFileRouter = {
    // Uploader pour les images de couverture des articles, réalisations, etc.
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            // Ici, tu pourras plus tard vérifier si l'utilisateur est connecté (admin)
            // Pour l'instant, on autorise tout le monde pour tester
            return { userId: "admin" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload terminé pour l'userId:", metadata.userId);
            console.log("URL du fichier:", file.url);
            return { uploadedBy: metadata.userId };
        }),
    
    // Uploader pour les documents PDF (Rapports)
    pdfUploader: f({ "application/pdf": { maxFileSize: "16MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            return { userId: "admin" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("PDF Upload terminé:", file.url);
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;