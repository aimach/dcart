import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_KEY as string,
	process.env.MAILJET_API_SECRET as string,
);

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
	await mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: "ton.email@tondomaine.com",
					Name: "TonApp Support",
				},
				To: [
					{
						Email: to,
						Name: to,
					},
				],
				Subject: "Réinitialisation de votre mot de passe",
				HTMLPart: `
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p><a href="${resetLink}">Cliquez ici pour le réinitialiser</a></p>
            <p>Ce lien expirera dans 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          `,
			},
		],
	});
};
