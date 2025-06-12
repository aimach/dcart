const divinityRequest = `
SELECT 
    DISTINCT string_agg(element.id::text, ',')
FROM element
LEFT JOIN element_categorie 
ON element_categorie.id_element = element.id
WHERE element_categorie.id_element IS NULL`;

export { divinityRequest };
