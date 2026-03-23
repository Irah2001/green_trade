import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni." });
    }

    const imageUrl = req.file.path;

    return res.status(200).json({ 
      message: "Image uploadée avec succès.",
      imageUrl: imageUrl 
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'upload de l'image." });
  }
};
