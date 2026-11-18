import { db } from "./database";

export const initDb = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        home_goals INTEGER NOT NULL,
        away_goals INTEGER NOT NULL,
        result TEXT NOT NULL,
        referee TEXT NOT NULL,
        attendance INTEGER NOT NULL
    )`);

    db.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_match
        ON matches (date, home_team, away_team)
    `);
};