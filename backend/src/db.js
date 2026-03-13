import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    user: "luiseche",
    host: "localhost",
    database: "realflow",
    port: 5432,
});