import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import PostgresStorage from "./db-adapters/postgres.js";

import {authMiddleware} from "./helpers/authMiddleware.js";

import contactRoutes from "./routes/contact.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import segmentRoutes from "./routes/segment.routes.js";
import messageRoutes from "./routes/message.routes.js";
import linkRoutes from "./routes/Link.routes.js";
import emailContentRoutes from "./routes/emailContent.routes.js";
import emailTemplateRoutes from "./routes/emailTemplate.routes.js";
import languageRoutes from "./routes/language.routes.js";

import feedbackRoutes from "./routes/feedback.routes.js";

dotenv.config();

const app = express();
const storage = PostgresStorage();
const api = "/api";


app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));


app.post(`${api}/signup`,authMiddleware, async (req, res) => {
    try {
        const {firstname, lastname, country, city, address, phone, email, password} = req.body;

        if (!firstname || !email || !password) {
            return res.status(400).json({message: "Champs manquants"});
        }

        const existing = await storage.dbQuery(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({message: "Email déjà utilisé"});
        }

        const hashed = await bcrypt.hash(password, 10);

        const result = await storage.dbQuery(
            `
                INSERT INTO users
                (firstname, lastname, country, city, address, phone, email, password, userId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, firstname, lastname, country, city, address, phone, email, userId
            `,
            [
                firstname,
                lastname,
                country || null,
                city || null,
                address || null,
                phone || null,
                email,
                hashed,
                req.user?.id || null
            ]
        );

        return res.status(201).json({
            message: "Utilisateur créé",
            user: result.rows[0]
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({message: "Erreur serveur"});
    }
});


app.post(`${api}/login`, async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password)
            return res.status(400).json({message: "Champs manquants"});

        const result = await storage.dbQuery(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        const user = result.rows[0];
        if (!user) return res.status(401).json({message: "Identifiants invalides"});

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({message: "Identifiants invalides"});

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                country: user.country,
                city: user.city,
                address: user.address,
                phone: user.phone
            },
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        res.json({
            message: "Connexion réussie",
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                id:user.id
            },
            token
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({message: "Erreur serveur"});
    }
});


app.use(`${api}/contacts`, contactRoutes);
app.use(`${api}/organizations`, organizationRoutes);
app.use(`${api}/departments`, departmentRoutes);
app.use(`${api}/segments`, segmentRoutes);
app.use(`${api}/messages`, messageRoutes);
app.use(`${api}/links`, linkRoutes);
app.use(`${api}/emailContents`, emailContentRoutes);
app.use(`${api}/emailTemplates`, emailTemplateRoutes);
app.use(`${api}/languages`, languageRoutes);
app.use(`${api}/feedbacks`, feedbackRoutes);

app.get(`${api}/surveys/templates`, authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const SYSTEM_USER_ID = 6;

        const query = `
            SELECT s.id,
                   s.name,
                   s.istemplate
            FROM surveys s
                     JOIN users u ON s.userid = u.id
            WHERE s.istemplate = true
              AND (s.userid = $1 OR s.userid = $2)
            ORDER BY s.name
        `;

        const result = await storage.dbQuery(query, [userId, SYSTEM_USER_ID]);

        return res.json(result.rows);

    } catch (err) {
        console.error("Get templates error:", err);
        return res.status(500).json({message: "Erreur serveur"});
    }
});

app.get(`${api}/surveys/:id`, async (req, res) => {
    try {
        const {id} = req.params;

        const survey = await storage.getSurvey(id);

        if (!survey) {
            return res.status(404).json({message: "Survey non trouvé"});
        }

        res.json({
            message: "Survey récupéré",
            survey
        });

    } catch (err) {
        console.error("Get survey error:", err);
        res.status(500).json({message: "Erreur interne"});
    }
});

app.put(`${api}/surveys/:id/setTemplate`, authMiddleware, async (req, res) => {
    try {
        const surveyId = req.params.id;
        const userId = req.user?.id;

        const {rows} = await storage.dbQuery(
            "SELECT id, userid FROM surveys WHERE id = $1",
            [surveyId]
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Survey non trouvé"});
        }

        const survey = rows[0];

        if (survey.userid !== userId) {
            return res.status(403).json({
                message: "Vous n'avez pas la permission de modifier ce sondage"
            });
        }

        const updateResult = await storage.dbQuery(
            `
                UPDATE surveys
                SET istemplate = true
                WHERE id = $1
                RETURNING id, name, istemplate
            `,
            [surveyId]
        );

        return res.json({
            message: "Le sondage est maintenant un template",
            survey: updateResult.rows[0]
        });

    } catch (err) {
        console.error("Set template error:", err);
        return res.status(500).json({message: "Erreur serveur"});
    }
});

app.post(`${api}/surveys`, authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const {title, json = {}, surveytheme} = req.body;

        let name = "Untitled";

        if (typeof title === "string" && title.trim()) {
            name = title.trim();
        } else if (json?.title) {
            if (typeof json.title === "string" && json.title.trim()) {
                name = json.title.trim();
            } else if (typeof json.title === "object") {
                const locale = json.locale || Object.keys(json.title)[0];
                name = json.title[locale] || json.title.fr || "Untitled";
            }
        }
        const survey = await storage.addSurvey(name, user.id);

        const storedSurvey = await storage.storeSurvey(
            survey.id,
            name,
            json,
            user.id,
            surveytheme
        );

        return res.status(201).json({
            message: "Survey créé",
            survey: storedSurvey
        });

    } catch (err) {
        console.error("Create survey error:", err);
        return res.status(500).json({message: "Erreur interne"});
    }
});

app.put(`${api}/surveys/:id/json`, authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const {json, surveytheme} = req.body;

        const rows = await storage.dbQuery(
            "SELECT id, userid FROM surveys WHERE id = $1",
            [id]
        );

        if (rows.rows.length === 0) {
            return res.status(404).json({message: "Survey non trouvé"});
        }

        const existingSurvey = rows.rows[0];
        const ownerId = existingSurvey.userid;

        let name = "Untitled";

        if (typeof json?.title === "string" && json.title.trim()) {
            name = json.title.trim();
        } else if (typeof json?.title === "object") {
            const locale =
                json.locale || Object.keys(json.title)[0];
            name =
                json.title[locale] ||
                json.title.fr ||
                "Untitled";
        }

        const updatedSurvey = await storage.storeSurvey(
            id,
            name,
            json,
            ownerId,
            surveytheme
        );

        return res.json({
            message: "Survey mis à jour",
            survey: updatedSurvey
        });

    } catch (err) {
        console.error("Update JSON error:", err);
        return res.status(500).json({message: "Erreur interne du serveur"});
    }
});

app.put(`${api}/surveys/:id/unsetTemplate`, authMiddleware, async (req, res) => {
    try {
        const surveyId = req.params.id;
        const userId = req.user.id;

        const {rows} = await storage.dbQuery(
            "SELECT id, userid FROM surveys WHERE id = $1",
            [surveyId]
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Survey not found"});
        }

        const survey = rows[0];

        if (survey.userid !== userId) {
            return res.status(403).json({
                message: "Vous n'avez pas la permission de modifier ce sondage"
            });
        }

        const updateResult = await storage.dbQuery(
            `
                UPDATE surveys
                SET istemplate = false
                WHERE id = $1
                RETURNING id, name, istemplate
            `,
            [surveyId]
        );

        return res.json({
            message: "Survey unset as template successfully",
            survey: updateResult.rows[0]
        });

    } catch (err) {
        console.error("Unset template error:", err);
        return res.status(500).json({message: "Erreur serveur"});
    }
});

app.post(`${api}/surveys/submit`, async (req, res) => {
    try {
        const {postId, surveyResult} = req.body;

        if (!postId || !surveyResult)
            return res.status(400).json({message: "postId ou surveyResult manquant"});

        const result = await storage.postResults(postId, surveyResult);

        return res.json({
            message: "Réponses enregistrées",
            result: result.json
        });

    } catch (err) {
        return res.status(500).json({message: "Erreur serveur"});
    }
});

app.get(`${api}/surveys`, authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const surveys = await storage.dbQuery(
            "SELECT * FROM surveys WHERE userid = $1 ORDER BY id DESC",
            [userId]
        );

        return res.json(surveys.rows);

    } catch (err) {
        console.error("Get surveys error:", err);
        return res.status(500).json({message: "Erreur interne"});
    }
});

app.get(`${api}/surveys/:id/results`, authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const results = await storage.getResults(id);
        return res.json(results);

    } catch (err) {
        return res.status(500).json({message: "Erreur interne"});
    }
});

app.delete(`${api}/surveys/:id`, authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;

        const deleted = await storage.deleteSurvey(id);
        if (!deleted)
            return res.status(404).json({message: "Survey non trouvé"});

        return res.json({message: "Survey supprimé"});

    } catch (err) {
        return res.status(500).json({message: "Erreur interne"});
    }
});


export default app;
