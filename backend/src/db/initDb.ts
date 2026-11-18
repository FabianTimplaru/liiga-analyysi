import { db } from "./database";

export const initDb = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    home_team TEXT,
    away_team TEXT,
    home_goals INTEGER,
    away_goals INTEGER,
    result TEXT,
    referee TEXT,
    attendance INTEGER
    )`);
};