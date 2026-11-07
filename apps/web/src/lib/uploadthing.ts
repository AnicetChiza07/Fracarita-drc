import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// On exporte le hook pour avoir un contrôle total sur l'UI
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();