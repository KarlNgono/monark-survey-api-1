import "dotenv/config";
import fs from "fs";
import SqlCrudAdapter from "./sql-crud-adapter.js";
import SurveyStorage from "./survey-storage.js";
import pkg from "pg";
const { Pool } = pkg;

const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);

function PostgresStorage() {
  async function dbQuery(query, params) {
    return pool.query(query, params);
  }

  const queryExecutorFunction = (...args) => {
    if (process.env.DATABASE_LOG) console.log(args[0], args[1]);
    return pool.query(...args);
  };

  const dbQueryAdapter = new SqlCrudAdapter(queryExecutorFunction);
  const surveyStorage = new SurveyStorage(dbQueryAdapter);

  surveyStorage.dbQuery = dbQuery;
  surveyStorage.pool = pool;

  return surveyStorage;
}

export default PostgresStorage;
