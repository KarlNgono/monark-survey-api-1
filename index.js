require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const PostgresStorage = require("./db-adapters/postgres");
const pgSession = require("connect-pg-simple")(session);

const apiBaseAddress = "/api";

const app = express();
const storage = PostgresStorage();
const sessionStore = new pgSession({
    pool: storage.pool,
    tableName: "user_sessions",
    createTableIfMissing: true
});

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 ,
        sameSite: "lax",
        secure: false
    }
}));

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

app.get(apiBaseAddress + "/getUsers", async (req, res) => {
    try {
        const result = await storage.dbQuery("SELECT id, name, email FROM users ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.delete(apiBaseAddress + "/users/:id", async (req, res) => {
    const {id} = req.params;
    try {
        await storage.dbQuery("DELETE FROM users WHERE id = $1", [id]);
        res.json({message: "Utilisateur supprimé", id});
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.post(apiBaseAddress + "/updateUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {name, email, password} = req.body;
        if (!name || !email) return res.status(400).json({message: "Missing fields"});

        let query = "UPDATE users SET name=$1, email=$2";
        const values = [name, email];

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            query += ", password=$3";
            values.push(hashed);
        }

        query += " WHERE id=$" + (values.length + 1) + " RETURNING id, name, email";
        values.push(id);

        const result = await storage.dbQuery(query, values);
        const updatedUser = result.rows[0];
        if (!updatedUser) return res.status(404).json({message: "User not found"});

        res.json({message: "User updated", user: updatedUser});
    } catch (err) {
        console.error("Update user error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.post(apiBaseAddress + "/changePassword", async (req, res) => {
    try {
        const {id, newPassword} = req.body;
        if (!id || !newPassword) return res.status(400).json({message: "Missing fields"});

        const hashed = await bcrypt.hash(newPassword, 10);
        await storage.dbQuery("UPDATE users SET password=$1 WHERE id=$2", [hashed, id]);
        res.json({message: "Password updated"});
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.post(apiBaseAddress + "/signup", async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) return res.status(400).json({message: "Missing fields"});

        const existing = await storage.dbQuery("SELECT id FROM users WHERE email=$1", [email]);
        if (existing.rows.length > 0) return res.status(409).json({message: "Email already exists"});

        const hashed = await bcrypt.hash(password, 10);
        const result = await storage.dbQuery(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashed]
        );
        const user = result.rows[0];
        req.session.userId = user.id;
        res.json({message: "User created", user});
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.post(apiBaseAddress + "/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({message: "Missing fields"});

        const result = await storage.dbQuery("SELECT id, name, email, password FROM users WHERE email=$1", [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({message: "Invalid credentials"});

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({message: "Invalid credentials"});

        req.session.userId = user.id;
        res.json({message: "Login successful", user: {id: user.id, name: user.name, email: user.email}});
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.post(apiBaseAddress + "/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({message: "Logout failed"});
        res.clearCookie("connect.sid");
        res.json({message: "Logged out"});
    });
});

app.get(apiBaseAddress + "/me", async (req, res) => {
    try {
        if (!req.session.userId) return res.status(401).json({message: "Not authenticated"});

        const result = await storage.dbQuery("SELECT id, name, email FROM users WHERE id=$1", [req.session.userId]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({message: "Not authenticated"});

        res.json(user);
    } catch (err) {
        console.error("Me error:", err);
        res.status(500).json({message: "Server error"});
    }
});

app.get(apiBaseAddress + "/getActive", (req, res) => storage.getSurveys(result => res.json(result)));

app.get(apiBaseAddress + "/getSurvey", (req, res) => {
    const surveyId = req.query["surveyId"];
    storage.getSurvey(surveyId, result => res.json(result));
});

app.get(apiBaseAddress + "/changeName", (req, res) => {
    const id = req.query["id"];
    const name = req.query["name"];
    storage.changeName(id, name, result => res.json(result));
});

app.post(`${apiBaseAddress}/create`, async (req, res) => {
    try {
        const { title, json, surveytheme } = req.body;

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

        let createdby = "Anonymous";
        if (req.session?.userId) {
            const result = await storage.dbQuery("SELECT name FROM users WHERE id = $1", [req.session.userId]);
            if (result.rows.length > 0) createdby = result.rows[0].name;
        }

        storage.addSurvey(name, createdby, survey => {
            storage.storeSurvey(survey.id, name, json, createdby, surveytheme, storedSurvey => {
                res.status(201).json({
                    message: "Survey created successfully",
                    survey: storedSurvey
                });
            });
        });
    } catch (error) {
        console.error("Create survey error:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

app.post(`${apiBaseAddress}/changeJson`, async (req, res) => {
    try {
        const { id, json, surveytheme } = req.body;

        let name = "Untitled";
        if (typeof json?.title === "string" && json.title.trim()) {
            name = json.title.trim();
        } else if (typeof json?.title === "object") {
            const locale = json.locale || Object.keys(json.title)[0];
            name = json.title[locale] || json.title.fr || "Untitled";
        }

        let createdby = "Anonymous";
        if (req.session?.userId) {
            const result = await storage.dbQuery("SELECT name FROM users WHERE id = $1", [req.session.userId]);
            if (result.rows.length > 0) createdby = result.rows[0].name;
        }

        storage.storeSurvey(id, name, json, createdby, surveytheme, updatedSurvey => {
            if (!updatedSurvey) return res.status(500).json({ message: "Erreur lors de la mise à jour du sondage" });
            res.status(200).json({
                message: "Survey updated successfully",
                survey: updatedSurvey
            });
        });
    } catch (error) {
        console.error("Change JSON error:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});


app.post(apiBaseAddress + "/post", (req, res) => {
    const {postId, surveyResult} = req.body;
    storage.postResults(postId, surveyResult, result => res.json(result.json));
});

app.get(apiBaseAddress + "/delete", (req, res) => {
    const id = req.query["id"];
    storage.deleteSurvey(id, () => res.json({id}));
});

app.get(apiBaseAddress + "/results", (req, res) => {
    const postId = req.query["postId"];
    storage.getResults(postId, result => res.json(result));
});

app.get("/api/results/:postId", (req, res) => {
    const postId = req.params.postId;
    storage.getResults(postId, result => res.json(result));
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

