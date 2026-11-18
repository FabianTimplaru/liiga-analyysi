import { initDb } from "../db/initDb";
import type { CsvMatch } from "../models/CsvMatch";
import type { Match } from "../models/Match";
import { DataHandler } from "../services/DataHandler";
import { db } from "../db/database";

// Initialize the database (create tables if they don't exist)
initDb();

// Read the CSV file, convert the records to Match objects, and insert them into the database
const records = DataHandler.parseCsv<CsvMatch>('../data/liiga25-26.csv');
const matches: Match[] = records.map(DataHandler.toMatch);
DataHandler.insertMatches(matches);
const result = db.prepare(`SELECT COUNT(*) AS total FROM matches`).get() as { total: number; };
console.log(`Total matches: ${result.total}`);
