import "dotenv/config";
import SqlCrudAdapter from "./sql-crud-adapter.js";
import SurveyStorage from "./survey-storage.js";
import pkg from "pg";

const { Pool } = pkg;

const dbConfig = {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false
};

const pool = new Pool(dbConfig);

function PostgresStorage() {

    const dbQuery = async (text, params) => {
        return pool.query(text, params);
    };

    const dbQueryAdapter = new SqlCrudAdapter(dbQuery);

    const storage = new SurveyStorage(dbQueryAdapter, dbQuery);

    storage.dbQuery = dbQuery;
    storage.pool = pool;
    storage.adapter = dbQueryAdapter;

    return storage;
}

export default PostgresStorage;
