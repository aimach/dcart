const divinityRequest = `
SELECT 
   STRING_AGG(id::text, ',' ORDER BY id) AS ids
FROM element
WHERE type = 'theonym'`;

export { divinityRequest };
