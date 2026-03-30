import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du transporteur SMTP
const isDevelopment = process.env.NODE_ENV !== 'production';

// Pour le développement, on peut utiliser Ethereal (compte de test)
// Pour la production, on utilise Gmail
const transporter = isDevelopment && !process.env.EMAIL_PASSWORD
  ? nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    })
  : nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

// Fonction utilitaire pour lire un template HTML
const readTemplate = (templateName: string): string => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf8');
};

// Fonction utilitaire pour remplacer les variables dans un template
const replaceVariables = (template: string, variables: Record<string, string>): string => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });
  return result;
};

// Envoyer un email de bienvenue
export const sendWelcomeEmail = async (to: string, firstName: string): Promise<void> => {
  try {
    const template = readTemplate('welcome');
    const html = replaceVariables(template, { Prénom: firstName });

    await transporter.sendMail({
      from: `GreenTrade <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@greentrade.com'}>`,
      to,
      subject: 'Bienvenue sur GreenTrade',
      html,
    });

    console.log('Email de bienvenue envoyé à:', to);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    throw error;
  }
};

// Envoyer un email de réinitialisation de mot de passe
export const sendResetPasswordEmail = async (
  to: string,
  firstName: string,
  resetToken: string
): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5001'}/reset-password?token=${resetToken}`;
    const template = readTemplate('reset-password');
    const html = replaceVariables(template, {
      Prénom: firstName,
      ResetUrl: resetUrl,
    });

    await transporter.sendMail({
      from: `GreenTrade <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@greentrade.com'}>`,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html,
    });

    console.log('Email de réinitialisation envoyé à:', to);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw error;
  }
};

// Envoyer un email de notification de changement de mot de passe
export const sendPasswordChangedEmail = async (
  to: string,
  firstName: string,
  email: string
): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5001'}/forgot-password`;
    const now = new Date();
    const dateTime = now.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const template = readTemplate('password-changed');
    const html = replaceVariables(template, {
      Prénom: firstName,
      Email: email,
      DateTime: dateTime,
      ResetUrl: resetUrl,
    });

    await transporter.sendMail({
      from: `GreenTrade <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@greentrade.com'}>`,
      to,
      subject: 'Votre mot de passe a été modifié',
      html,
    });

    console.log('Email de changement de mot de passe envoyé à:', to);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de changement de mot de passe:', error);
    throw error;
  }
};

// Envoyer un email de confirmation de commande
export const sendOrderConfirmationEmail = async (
  to: string,
  firstName: string,
  orderDetails: { productName: string; quantity: number; total: number }
): Promise<void> => {
  try {
    const orderUrl = `${process.env.FRONTEND_URL || 'http://localhost:5001'}/orders`;
    const template = readTemplate('order-confirmation');
    const html = replaceVariables(template, {
      Prénom: firstName,
      ProductName: orderDetails.productName,
      Quantity: orderDetails.quantity.toString(),
      Total: orderDetails.total.toFixed(2),
      OrderUrl: orderUrl,
    });

    await transporter.sendMail({
      from: `GreenTrade <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@greentrade.com'}>`,
      to,
      subject: 'Confirmation de votre commande',
      html,
    });

    console.log('Email de confirmation de commande envoyé à:', to);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
};

// Envoyer une notification au producteur
export const sendProducerNotificationEmail = async (
  to: string,
  producerName: string,
  orderDetails: { productName: string; quantity: number; buyerName: string }
): Promise<void> => {
  try {
    const orderUrl = `${process.env.FRONTEND_URL || 'http://localhost:5001'}/orders`;
    const template = readTemplate('producer-notification');
    const html = replaceVariables(template, {
      ProducteurNom: producerName,
      ProductName: orderDetails.productName,
      Quantity: orderDetails.quantity.toString(),
      BuyerName: orderDetails.buyerName,
      OrderUrl: orderUrl,
    });

    await transporter.sendMail({
      from: `GreenTrade <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@greentrade.com'}>`,
      to,
      subject: 'Nouvelle commande reçue',
      html,
    });

    console.log('Notification producteur envoyée à:', to);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification producteur:', error);
    throw error;
  }
};

