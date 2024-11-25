import nodemailer from 'nodemailer';
import { User, UserRole } from '../schema/types';

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  static async sendAccountValidationEmail(
    user: User,
    validatedBy: User | { role: UserRole }
  ): Promise<void> {
    const validatorName = 'firstName' in validatedBy 
      ? `${validatedBy.firstName} ${validatedBy.lastName}`
      : validatedBy.role;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@mynurseshift.com',
      to: user.email,
      subject: 'Votre compte MyNurseShift a été validé',
      html: `
        <h1>Compte validé</h1>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre compte MyNurseShift vient d'être validé par ${validatorName}.</p>
        <p>Vous pouvez maintenant vous connecter à l'application avec votre email et votre mot de passe.</p>
        <p>Cordialement,<br>L'équipe MyNurseShift</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de validation:', error);
      // On ne relance pas l'erreur pour ne pas bloquer le processus de validation
    }
  }

  static async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetLink = `${process.env.WEBAPP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@mynurseshift.com',
      to: email,
      subject: 'Réinitialisation de votre mot de passe MyNurseShift',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Cordialement,<br>L'équipe MyNurseShift</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
  }
}
