import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exporte les routes GET et POST pour Uploadthing
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});