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
import { getDatationSentence } from "../../../utils/functions/functions";
import { getAllAttestationsFromSourceId } from "../../../utils/loaders/loaders";
// import du style
import style from "./tabComponent.module.scss";

type SourceDetailsComponentProps = {
	source: SourceType;
	isSelected: boolean;
	mapId: string;
};

const SourceDetailsComponent = ({
	source,
	isSelected,
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

	const fetchAllAttestations = async () => {
		try {
			const allAttestations = await getAllAttestationsFromSourceId(
				source.source_id.toString(),
			);
			setAttestations(allAttestations);
		} catch (error) {
			console.error("Erreur lors du chargement des infos de la carte:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (sourceIsSelected && attestations.length === 0) {
			fetchAllAttestations();
		}
	}, [sourceIsSelected, source.source_id, attestations.length]);

	return (
		<details
			style={{ marginLeft: "10px" }}
			onClick={() => setSourceIsSelected(true)}
			onKeyUp={() => setSourceIsSelected(true)}
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
						agentsArray = attestation.agents.map((agentElement: AgentType) => {
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
									sanitizedAgentInSelectedLanguage[language === "fr" ? 0 : 1];
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
						});
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
				})
			) : (
				<LoaderComponent size={40} />
			)}
		</details>
	);
};

export default SourceDetailsComponent;
