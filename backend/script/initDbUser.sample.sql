CREATE USER your_user WITH PASSWORD 'your_strong_password';
CREATE DATABASE your_db;
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;

-- Connecter à la base de données pour configurer le schéma public
\c your_db

-- Donner l'accès au schéma public à l'utilisateur
GRANT USAGE ON SCHEMA public TO your_user;
GRANT CREATE ON SCHEMA public TO your_user;

-- on ajoute un temps d'attente, sinon l'utilisateur est créé en même temps que le redémarrage de pg, ce qui entraîne des conflits
SELECT pg_sleep(5);



