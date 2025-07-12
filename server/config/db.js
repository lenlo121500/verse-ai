import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "./envVars.js";

const sql = neon(DATABASE_URL);

export default sql;
