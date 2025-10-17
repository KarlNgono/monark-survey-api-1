# Monark Survey API

Ce projet est une application **Express** intégrant :
- Creation et suppression des sondages
- Lecture et modification des sondages
- Recuperation des resultats de sondags
- Persistance avec**PostgreSQL**

---

## Prérequis

Avant de commencer, installé :

- NodeJs 22
- [PostgreSQL 17](https://www.postgresql.org/download/)
- Ouvrir pgAdmin
- Creer la base de donnees **MonarkSurvey**
- Lancer le script sql contenu dans : postgres\initdb\surveyjs
---
### Lancer l’application

Pour compiler et exécuter l’application :
- npm install

- node index.js

Une fois l’application démarrée, tu peux tester toutes les routes via :

http://localhost:tonport
              
---

```properties
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=MonarkSurvey
DATABASE_USER=tonuser
DATABASE_PASSWORD=tonmotdepasse
SESSION_SECRET=xbookaweroop22341opej
DATABASE_LOG=true
FRONTEND_URL=urldemonarksurveyclient
DATABASE_SSL=true
PORT= tonport
