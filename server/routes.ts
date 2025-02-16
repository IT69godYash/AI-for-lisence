import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { analyzeCopyright, generateAlternativeVersion } from "./openai";
import { insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/documents", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const documents = await storage.getDocumentsByUserId(req.user.id);
    res.json(documents);
  });

  app.post("/api/documents", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const validation = insertDocumentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const document = await storage.createDocument({
      ...validation.data,
      userId: req.user.id,
    });

    res.status(201).json(document);
  });

  app.post("/api/documents/:id/analyze", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const document = await storage.getDocument(parseInt(req.params.id));
    if (!document) return res.status(404).send("Document not found");
    if (document.userId !== req.user.id) return res.sendStatus(403);

    try {
      const analysis = await analyzeCopyright(document.content);
      const alternativeVersion = await generateAlternativeVersion(document.content, analysis);

      const updated = await storage.updateDocument(document.id, {
        copyrightAnalysis: analysis,
        alternativeVersion,
        analyzed: true,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
