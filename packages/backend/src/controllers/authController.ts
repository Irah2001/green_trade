import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prismaClient.js';
import { sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Regex pour validation du mot de passe
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, accountType, city, postalCode, phone } = req.body;

    // Validation du mot de passe
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: accountType,
        city,
        postalCode,
        phone,
      },
    });

    // Envoi de l'email de bienvenue
    try {
      await sendWelcomeEmail(user.email, user.firstName || 'Client');
    } catch (emailError) {
      console.error('Erreur envoi email bienvenue:', emailError);
      // On continue même si l'email échoue
    }

    // Génération du Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un succès
      return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    // Génération d'un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = new Date(Date.now() + 900000); // 15 minutes

    // Sauvegarde du token dans la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      },
    });

    // Envoi de l'email
    try {
      await sendResetPasswordEmail(user.email, user.firstName || 'Client', resetToken);
      console.log('[OK] Email de reset envoyé avec succès à:', user.email);
    } catch (emailError) {
      console.error('[ERREUR] Erreur envoi email reset:', emailError);
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email.", error: emailError instanceof Error ? emailError.message : 'Unknown error' });
    }

    res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
  } catch (error) {
    console.error('Erreur complète dans forgotPassword:', error);
    res.status(500).json({ message: "Erreur lors de la demande de réinitialisation.", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Validation du nouveau mot de passe
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      });
    }

    // Recherche des utilisateurs avec un token non expiré
    const users = await prisma.user.findMany({
      where: {
        resetTokenExpiry: { gte: new Date() },
      },
    });

    // Trouver l'utilisateur correspondant au token
    let userToReset = null;
    for (const user of users) {
      if (user.resetToken && await bcrypt.compare(token, user.resetToken)) {
        userToReset = user;
        break;
      }
    }

    if (!userToReset) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // Mise à jour du mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userToReset.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Envoi de l'email de notification
    try {
      await sendPasswordChangedEmail(userToReset.email, userToReset.firstName || 'Client', userToReset.email);
      console.log(`[OK] Email de confirmation envoyé à ${userToReset.email}`);
    } catch (emailError) {
      console.error('[ERREUR] Échec de l\'envoi de l\'email de confirmation:', emailError);
    }

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
  }
};
