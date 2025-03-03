// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
// import des composants
import LoaderComponent from "../../common/loader/LoaderComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des types
import type {
	AgentType,
	AttestationType,
	SourceType,
} from "../../../utils/types/mapTypes";
// import des services
import {
	getAgentsArrayWithoutDuplicates,
	getDatationSentence,
} from "../../../utils/functions/map";
import { getAllAttestationsFromSourceId } from "../../../utils/api/getRequests";
// import du style
import style from "./tabComponent.module.scss";

type SourceDetailsComponentProps = {
	source: SourceType;
	mapId: string;
};

const SourceDetailsComponent = ({
	source,
	mapId,
}: SourceDetailsComponentProps) => {
	// on récupère le language
	const { language, translation } = useContext(TranslationContext);

	// on prépare les clés pour l'objet de traduction
	const attestationNameLanguageKey: keyof AttestationType =
		language === "fr" ? "nom_fr" : "nom_en";

	// on prépare la string de datation
	const datationSentence = getDatationSentence(source, translation, language);

	// si la source est sélectionnée, on va chercher les attestations correspondantes
	const [attestations, setAttestations] = useState<AttestationType[]>(
		mapId === "exploration" ? [] : source.attestations,
	);
	const [sourceIsSelected, setSourceIsSelected] = useState<boolean>(false);

	useEffect(() => {
		const fetchAllAttestations = async () => {
			const allAttestations = await getAllAttestationsFromSourceId(
				source.source_id.toString(),
			);
			setAttestations(allAttestations);
		};
		if (sourceIsSelected && attestations.length === 0) {
			fetchAllAttestations();
		}
	}, [sourceIsSelected, source.source_id, attestations]);

	return (
		<details
			onClick={() => setSourceIsSelected(true)}
			onKeyUp={() => setSourceIsSelected(true)}
			className={style.selectionDetails}
		>
			<summary>
				Source #{source.source_id} {datationSentence}
			</summary>
			{attestations.length ? (
				attestations.map((attestation: AttestationType) => {
					// on prépare l'extrait avec restitution en vérifiant qu'il ne contient que du code validé
					const sanitizedRestitution = DOMPurify.sanitize(
						attestation.extrait_avec_restitution,
					);
					let agentsArray: JSX.Element[] = [];
					if (attestation.agents?.length) {
						// on supprime les doublons causés par l'activité (si plusieurs activités pour 1 même agent, il revient plusieurs fois dans le tableau)
						const agentsWithoutDuplicates = getAgentsArrayWithoutDuplicates(
							attestation.agents,
						);
						agentsArray = agentsWithoutDuplicates.map(
							(agentElement: AgentType) => {
								let agent = "";
								if (agentElement.designation === null) {
									agent = `(${translation[language].mapPage.aside.noDesignation})`;
								} else {
									// on prépare la string de l'agent en vérifiant qu'il ne contient que du code validé,
									// qu'il correspond au langage choisi
									const sanitizedAgent = DOMPurify.sanitize(
										agentElement.designation,
									);
									const sanitizedAgentInSelectedLanguage =
										sanitizedAgent.split("<br>");
									if (sanitizedAgentInSelectedLanguage.length > 1) {
										agent =
											sanitizedAgentInSelectedLanguage[
												language === "fr" ? 0 : 1
											];
									} else {
										agent = sanitizedAgentInSelectedLanguage[0];
									}
								}
								return (
									<p
										key={uuidv4()}
										// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
										dangerouslySetInnerHTML={{
											__html: `- ${agent}`,
										}}
										style={{ marginBottom: "0.5rem" }}
									/>
								);
							},
						);
					}

					return (
						<div key={uuidv4()} className={style.testimoniesInfo}>
							<table>
								<tbody>
									<tr>
										<th>Attestation</th>
										<td>#{attestation.attestation_id}</td>
									</tr>
									<tr>
										<th>{translation[language].mapPage.aside.traduction}</th>
										<td>{attestation[attestationNameLanguageKey]}</td>
									</tr>
									<tr>
										<th>
											{translation[language].mapPage.aside.originalVersion}
										</th>
										<td>
											<p
												// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
												dangerouslySetInnerHTML={{
													__html: sanitizedRestitution,
												}}
											/>
										</td>
									</tr>
									<tr>
										<th>{translation[language].mapPage.aside.agents}</th>
										<td>
											<div>
												{agentsArray.length > 0
													? agentsArray
													: translation[language].mapPage.aside.noAgent}
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					);
				})
			) : (
				<LoaderComponent size={40} />
			)}
		</details>
	);
};

export default SourceDetailsComponent;
