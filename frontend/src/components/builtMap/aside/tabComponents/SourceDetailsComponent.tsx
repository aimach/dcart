// import des bibliothèques
import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
// import des composants
import LoaderComponent from "../../../common/loader/LoaderComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type {
	AgentType,
	AttestationType,
	SourceType,
} from "../../../../utils/types/mapTypes";
// import des services
import {
	getAgentsArrayWithoutDuplicates,
	getDatationSentence,
	getOptionalCellValue,
	getSanitizedAgent,
} from "../../../../utils/functions/map";
import { getAllAttestationsFromSourceId } from "../../../../utils/api/builtMap/getRequests";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { isSelectedFilterInThisMap } from "../../../../utils/functions/filter";
// import du style
import style from "./tabComponent.module.scss";
// import des icônes
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";

type SourceDetailsComponentProps = {
	source: SourceType;
};

/**
 * Retourne un accordéon avec les informations de la source et les tableaux des attestations
 * @param {SourceType} source - la source à afficher
 * @returns Les informations de la source et les attestations formatées en tableau
 */
const SourceDetailsComponent = ({ source }: SourceDetailsComponentProps) => {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	// récupération de l'id de la carte en cours
	const { mapId, mapSlug } = useParams();
	const mapIdentifier = mapId || mapSlug;

	// définition de la chaîne de caractères contenant les dates
	const datationSentence = getDatationSentence(source, translation, language);

	// définition d'un état permettant de stocker les attestations (si la carte est en mode exploration, on stocke un tableau vide car elles ne sont pas encore chargées)
	const [attestations, setAttestations] = useState<AttestationType[]>(
		mapIdentifier === "exploration" ? [] : source.attestations,
	);

	// définition d'un état permettant de savoir si la source est sélectionnée
	const [sourceIsSelected, setSourceIsSelected] = useState<boolean>(false);

	// récupération des attestations de la source si elles ne sont pas déjà chargées
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

	const { mapInfos } = useMapStore();

	// formatage des attestations avant affichage
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const formattedAttestations = useMemo(() => {
		return attestations?.map((attestation: AttestationType) => {
			// préparation de l'extrait avec restitution en vérifiant qu'il ne contient que du code validé
			const sanitizedRestitution = DOMPurify.sanitize(
				attestation.extrait_avec_restitution,
			);

			// récupération et affichage des agents
			let agentsString = null;
			if (attestation.agents) {
				agentsString = getAgentsArrayWithoutDuplicates(
					attestation.agents as AgentType[],
				).map((agentElement) => (
					<p
						key={uuidv4()}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
						dangerouslySetInnerHTML={{
							__html: `- ${getSanitizedAgent(agentElement, translation, language)}`,
						}}
						style={{ marginBottom: "0.5rem" }}
					/>
				));
			} else {
				agentsString = translation[language].mapPage.aside.noAgent;
			}

			// Retourne une attestation formatée
			return (
				<div key={attestation.attestation_id} className={style.testimoniesInfo}>
					<table>
						<tbody>
							<tr>
								<th>Attestation</th>
								<td>
									<a
										href={`https://base-map-polytheisms.huma-num.fr/attestation/${attestation.attestation_id}`}
										target="_blank"
										rel="noreferrer"
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.5rem",
										}}
									>
										#{attestation.attestation_id}
										<SquareArrowOutUpRight size={15} />
									</a>
								</td>
							</tr>
							<tr>
								<th>{translation[language].mapPage.aside.originalVersion}</th>
								<td>
									<p
										// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
										dangerouslySetInnerHTML={{ __html: sanitizedRestitution }}
									/>
								</td>
							</tr>
							<tr>
								<th>{translation[language].mapPage.aside.traduction}</th>
								<td>{attestation[`nom_${language}`]}</td>
							</tr>
							<tr>
								<th>{translation[language].mapPage.aside.agents}</th>
								<td>
									<div>{agentsString}</div>
								</td>
							</tr>
							{isSelectedFilterInThisMap(mapInfos, "agentActivity") && (
								<tr>
									<th>{translation[language].mapPage.aside.agentActivity}</th>
									<td>
										{getOptionalCellValue(
											attestation,
											`activite_${language}`,
											translation,
											language,
										)}
									</td>
								</tr>
							)}
							{isSelectedFilterInThisMap(mapInfos, "agentStatus") && (
								<tr>
									<th>{translation[language].mapPage.aside.agentStatus}</th>
									<td>
										{getOptionalCellValue(
											attestation,
											`statut_${language}`,
											translation,
											language,
										)}
									</td>
								</tr>
							)}
							{isSelectedFilterInThisMap(mapInfos, "agentivity") && (
								<tr>
									<th>{translation[language].mapPage.aside.agentivity}</th>
									<td>
										{getOptionalCellValue(
											attestation,
											"agentivity",
											translation,
											language,
										)}
									</td>
								</tr>
							)}
							{isSelectedFilterInThisMap(mapInfos, "sourceMaterial") && (
								<tr>
									<th>{translation[language].mapPage.aside.sourceMaterial}</th>
									<td>
										{source.types[`material_${language}`] ??
											translation[language].mapPage.aside
												.noSourceMaterialDefined}
									</td>
								</tr>
							)}
							{isSelectedFilterInThisMap(mapInfos, "sourceType") && (
								<tr>
									<th>{translation[language].mapPage.aside.sourceType}</th>
									<td>
										{source.types[`type_source_${language}`].reduce(
											(acc, type) =>
												type && acc.includes(type) ? acc : `${acc}, ${type}`,
										)}
									</td>
								</tr>
							)}
							{isSelectedFilterInThisMap(mapInfos, "language") && (
								<tr>
									<th>{translation[language].mapPage.aside.language}</th>
									<td>
										{source.types[`language_${language}`].reduce((acc, type) =>
											type && acc.includes(type) ? acc : `${acc}, ${type}`,
										)}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			);
		});
	}, [attestations, language, translation, mapInfos]);

	return (
		<details
			onClick={() => setSourceIsSelected(true)}
			onKeyUp={() => setSourceIsSelected(true)}
			className={style.selectionDetails}
		>
			<summary>
				<ChevronRight />
				Source #{source.source_id} {datationSentence}
			</summary>
			{attestations?.length ? (
				formattedAttestations
			) : (
				<LoaderComponent size={40} />
			)}
		</details>
	);
};

export default SourceDetailsComponent;
