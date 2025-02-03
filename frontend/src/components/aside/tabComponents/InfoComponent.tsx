// import des bibliothèques
import { useContext } from "react";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des types
import type {
	AgentType,
	AttestationType,
	PointType,
} from "../../../types/mapTypes";
// import des services
import { getDatationSentence } from "../../../utils/functions/functions";
// import du style
import style from "./tabComponent.module.scss";

interface InfoComponentProps {
	point: PointType;
	isSelected?: boolean;
}

const InfoComponent = ({ point, isSelected }: InfoComponentProps) => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	// on prépare les clés pour l'objet de traduction
	const subRegionLanguageKey: keyof PointType =
		language === "fr" ? "sous_region_fr" : "sous_region_en";
	const attestationNameLanguageKey: keyof AttestationType =
		language === "fr" ? "nom_fr" : "nom_en";

	// on créé une classe spéciale si le point est sélectionné
	const selectedClassName = isSelected ? style.isSelected : undefined;

	return (
		<details className={`${selectedClassName} ${style.resultContainer}`}>
			<summary>
				{point.nom_ville} ({point[subRegionLanguageKey]}) -{" "}
				{point.sources.length} {point.sources.length > 1 ? "sources" : "source"}
			</summary>
			{point.sources.map((source) => {
				const dataSentence = getDatationSentence(source, translation, language);

				return (
					<details key={source.source_id} style={{ marginLeft: "10px" }}>
						<summary>
							Source #{source.source_id} {dataSentence}
						</summary>
						{source.attestations.map((attestation: AttestationType) => {
							// on prépare l'extrait avec restitution en vérifiant qu'il ne contient que du code validé
							const sanitizedRestitution = DOMPurify.sanitize(
								attestation.extrait_avec_restitution,
							);
							let agentsArray: JSX.Element[] = [];
							if (attestation.agents?.length) {
								agentsArray = attestation.agents.map(
									(agentElement: AgentType) => {
										// on prépare la string de l'agent en vérifiant qu'il ne contient que du code validé,
										// qu'il correspond au langage choisi
										const sanitizedAgent = DOMPurify.sanitize(
											agentElement.designation,
										);
										const sanitizedAgentInSelectedLanguage =
											sanitizedAgent.split("<br>");
										let agent = "";
										if (sanitizedAgentInSelectedLanguage.length > 1) {
											agent =
												sanitizedAgentInSelectedLanguage[
													language === "fr" ? 0 : 1
												];
										} else {
											agent = sanitizedAgentInSelectedLanguage[0];
										}
										return (
											<p
												key={uuidv4()}
												// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
												dangerouslySetInnerHTML={{
													__html: agent,
												}}
											/>
										);
									},
								);
							}

							return (
								<div key={uuidv4()} className={style.testimoniesInfo}>
									<p>Attestation #{attestation.attestation_id}</p>
									<div style={{ marginLeft: "10px" }}>
										<p>{attestation[attestationNameLanguageKey]}</p>
										<p
											// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
											dangerouslySetInnerHTML={{
												__html: sanitizedRestitution,
											}}
										/>
										{agentsArray}
									</div>
								</div>
							);
						})}
					</details>
				);
			})}
		</details>
	);
};

export default InfoComponent;
