// LEGENDE des paramètres
// $1 = opérateur et nombre d'éléments dans l'attestation
// $2 = opérateur et nombre de puissances divines

export const getSourcesQuery = (
	queryLocalisation: string,
	elementOperator: string,
	divinityOperator: string,
	queryAnte: string,
	queryPost: string,
) => {
	return `
-- on récupère toutes les attestations avec les éléments correspondants
WITH attestation_with_elements AS (
SELECT 
  contient_element.id_attestation,
  json_agg(
    jsonb_build_object(
      'element_id', element.id,
      'etat_absolu', element.etat_absolu,
      'element_nom_fr', (SELECT nom_fr FROM traduction_element WHERE traduction_element.id_element = element.id LIMIT 1), -- pour n'avoir qu'une seule traduction, sinon ça répète l'élément
      'element_nom_en', (SELECT nom_en FROM traduction_element WHERE traduction_element.id_element = element.id LIMIT 1) -- pour n'avoir qu'une seule traduction, sinon ça répète l'élément
    )
  ) AS elements,
  COUNT(element.etat_absolu) as nb_element
  FROM contient_element
  JOIN element ON contient_element.id_element = element.id
  GROUP BY contient_element.id_attestation
),

-- on récupère toutes les sources avec les attestations correspondantes
sources_with_attestations AS (
 SELECT 
  attestation.id_source as source_id,
  jsonb_build_object(
        'attestation_id', attestation.id,
        'formule', (SELECT formule FROM formule WHERE formule.attestation_ID = attestation.ID LIMIT 1), -- pour n'avoir qu'un seul résultat
        'extrait_avec_restitution', attestation.extrait_avec_restitution,
        'translitteration', attestation.translitteration,
        'nom_fr', (SELECT nom_fr FROM traduction_attestation WHERE id_attestation = attestation.id LIMIT 1), -- pour n'avoir qu'un seul résultat
        'nom_en', (SELECT nom_en FROM traduction_attestation WHERE id_attestation = attestation.id LIMIT 1), -- pour n'avoir qu'un seul résultat
        'elements', attestation_with_elements.elements,
        'agents', (
                  SELECT jsonb_agg(agents) 
                  FROM 
                  (
                    SELECT 
                    agent.designation, 
                    activite_agent.nom_fr AS activite_fr, 
                    activite_agent.nom_en AS activite_en, 
                    (
                      SELECT 
                      jsonb_agg(jsonb_build_object('nom_fr', genre.nom_fr, 'nom_en', genre.nom_en)) 
                      FROM agent_genre 
                      JOIN genre ON genre.id = agent_genre.id_genre 
                      WHERE agent_genre.id_agent = agent.id
                    ) AS genres -- Tableaux des genres pour l'agent
                    FROM agent 
                    JOIN agent_activite ON agent_activite.id_agent = agent.id
                    JOIN activite_agent ON activite_agent.id = agent_activite.id_activite
                    JOIN agent_genre ON agent_genre.id_agent = agent.id 
                    JOIN genre on genre.id = agent_genre.id_genre 
                    WHERE agent.id_attestation = attestation.id 
                    GROUP BY 
                      agent.designation, 
                      activite_agent.nom_fr, 
                      activite_agent.nom_en, 
                      agent.id
                    ) 
                  AS agents
                  )
  ) AS attestations
  FROM attestation
  JOIN attestation_with_elements ON attestation.id = attestation_with_elements.id_attestation
  JOIN formule ON formule.attestation_id = attestation.id
  JOIN agent ON agent.id_attestation = attestation.id
  WHERE attestation_with_elements.nb_element ${elementOperator} $1 
),

-- on enlève les doublons des sources
sources_without_duplicate AS (
	SELECT 
    source.id as source_id,
		json_agg(DISTINCT sources_with_attestations.attestations) as sources
    FROM source
	JOIN sources_with_attestations ON source.id = sources_with_attestations.source_id 
	GROUP BY source.id
)

-- on regroupe les sources par localité et on récupère les métadonnées
SELECT 
  localisation_source.latitude, 
  localisation_source.longitude,
  sous_region.nom_fr AS sous_region_fr,
  sous_region.nom_en AS sous_region_EN,
  localisation_source.nom_ville,
	json_agg(
    DISTINCT jsonb_build_object(
      'source_id', sources_without_duplicate.source_id,
      'support_fr', type_support.nom_fr,
      'materiau_fr', materiau.nom_fr,
      'support_en', type_support.nom_en,
      'materiau_en', materiau.nom_en,
      'attestations', sources_without_duplicate.sources,
      'post_quem', datation.post_quem,
      'ante_quem', datation.ante_quem
    )
  ) AS sources
FROM source
JOIN sources_without_duplicate ON source.id = sources_without_duplicate.source_id 
INNER JOIN attestation ON attestation.ID_source = source.ID
LEFT JOIN localisation AS localisation_source ON source.localisation_DECOUVERTE_ID = localisation_source.ID
INNER JOIN sous_region ON sous_region.ID = localisation_source.sous_region_ID
INNER JOIN grande_region ON grande_region.ID = localisation_source.grande_region_ID
INNER JOIN formule ON formule.attestation_ID = attestation.ID
INNER JOIN source_langue ON source_langue.ID_source = attestation.ID_source
INNER JOIN datation ON datation.ID = source.datation_ID
LEFT JOIN type_support ON type_support.id = source.type_support_id
LEFT JOIN materiau ON materiau.id = source.materiau_id 
${queryLocalisation} 
AND formule.puissances_divines ${divinityOperator} $2
AND attestation.id_etat_fiche = 4 
AND localisation_source.latitude IS NOT NULL
AND localisation_source.longitude IS NOT NULL 
${queryAnte} ${queryPost} -- ajouter ici le filtre des dates
GROUP BY 
  localisation_source.latitude,
	localisation_source.longitude, 
  localisation_source.nom_ville, 
  sous_region.nom_fr, 
  sous_region.nom_en`;
};
