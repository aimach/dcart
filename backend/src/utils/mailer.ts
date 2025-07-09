import Mailjet from "node-mailjet";
import nodemailer from "nodemailer";

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_KEY as string,
	process.env.MAILJET_API_SECRET as string,
);

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
	const transporter = nodemailer.createTransport({
		host: "relay.huma-num.fr",
		port: 25,
		secure: false, // pas de SSL/TLS
		tls: {
			rejectUnauthorized: false, // parfois utile si le serveur a un certificat self-signed
		},
	});

	const mailOptions = {
		from: '"Application DCART" <dcart-map@huma-num.fr>', // ← à tester selon autorisation
		to: to,
		subject: "Réinitialisation de votre mot de passe",
		html: `
		  <p>Bonjour,</p>
		  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
		  <p><a href="${resetLink}">Cliquez ici pour le réinitialiser</a></p>
		  <p>Ce lien expirera dans 1 heure.</p>
		  <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
		`,
	};

	transporter.sendMail(mailOptions, (error) => {
		if (error) {
			console.error("Erreur envoi email :", error);
		}
	});
};
