import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 1000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connexion à la base réussie");

        await sequelize.sync();
        console.log("Synchronisation des modèles");

        app.listen(PORT, () =>
            console.log(`Serveur lancé sur le port ${PORT}`)
        );

    } catch (error) {
        console.error("Erreur lors du démarrage :", error);
    }
})();
