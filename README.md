# 🇫🇷 Version française

# DCART - Atlas numérique des noms divins en Méditerranée

**DCART** est une application open-source permettant aux utilisateurs d’explorer des cartes interactives et des *storymaps* basées sur les données de l’ERC MAP (Mapping Ancient Polytheisms). L’objectif est de proposer une visualisation géographique et narrative des divinités mentionnées dans les sources antiques, à travers des interfaces multilingues et immersives.

---

## 🛠️ Technologies utilisées

### Backend
- Node.js + Express
- PostgreSQL + TypeORM
- Authentification JWT
- Nodemailer (envoi d’e-mails)
- Joi (validation)

### Frontend
- React 18 + Zustand (state)
- Leaflet / React-Leaflet / MarkerCluster
- Multilingue avec i18next

---

## 🚀 Installation

### Pré-requis
- Node.js (v18 ou supérieur)
- PostgreSQL
- package manager

### Clone du dépôt
```bash
git clone https://github.com/ton-utilisateur/dcart.git
cd dcart
```

### BACKEND
```bash
cd backend
npm install
cp .env.sample .env
# Remplir les variables d’environnement
npm run dev
```


### FRONTEND
```bash
cd frontend
npm install
cp .env.sample .env
# Remplir les variables d’environnement
npm run dev
```

### PATCHES
Ajout d'un patch pour la librairie leaflet-side-by-side dans "src/utils/patch-library/leaflet-side-by-side.js" : modification de getContainer() par getPane().


# 🇬🇧 English version

**DCART** is an open-source application that allows users to explore interactive maps and *storymaps* based on data from the ERC MAP project (Mapping Ancient Polytheisms). The goal is to offer a multilingual and immersive geographic and narrative visualization of deities mentioned in ancient sources.

---

## 🛠️ Technologies Used

### Backend
- Node.js + Express
- PostgreSQL + TypeORM
- JWT Authentication
- Nodemailer (email delivery)
- Joi (data validation)

### Frontend
- React 18 + Zustand (state management)
- Leaflet / React-Leaflet / MarkerCluster
- Multilingual interface with i18next

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- A package manager (npm, yarn, or pnpm)

### Clone the Repository
```bash
git clone https://github.com/your-username/dcart.git
cd dcart
```

### BACKEND
```bash
cd backend
npm install
cp .env.sample .env
# Fill in the environment variables
npm run dev
```


### FRONTEND
```bash
cd frontend
npm install
cp .env.sample .env
# Fill in the environment variables
npm run dev
```


### PATCHES
A patch was added to the leaflet-side-by-side library in src/utils/patch-library/leaflet-side-by-side.js: getContainer() was replaced with getPane().
