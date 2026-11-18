import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import type { CsvMatch } from '../models/CsvMatch';
import type { Match } from '../models/Match';
import { db } from '../db/database';

export class DataHandler {

    // Parses a CSV file and returns an array of records of a generic type
    static parseCsv<T>(filePath: string): T[] {
        const data = readFileSync(filePath, 'utf8');
        const records: T[] = parse(data, {
            columns: true,
            skip_empty_lines: true
        });
        return records;
    };

    // Converts a CsvMatch object to a Match object
    static toMatch(match: CsvMatch): Match {
        return {
            date: match.Date.split('/').reverse().join('-'), // Convert DD/MM/YYYY to YYYY-MM-DD
            home_team: match.Kotijoukkue,
            away_team: match.Vierasjoukkue,
            home_goals: Number(match.MaalitKoti),
            away_goals: Number(match.MaalitVieras),
            result: match.Tulos,
            referee: match.Tuomari,
            attendance: Number(match.Katsojat)
        };
    }

    // Inserts an array of Match objects into the database
    static insertMatches(matches: Match[]): void {
        const insertStatement = db.prepare(`
            INSERT INTO matches(
            date,
            home_team,
            away_team,
            home_goals,
            away_goals,
            result,
            referee,
            attendance
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

        const transaction = db.transaction((items: Match[]) => {
            for (const item of items) {
                insertStatement.run(
                    item.date,
                    item.home_team,
                    item.away_team,
                    item.home_goals,
                    item.away_goals,
                    item.result,
                    item.referee,
                    item.attendance
                );
            }
        });
        transaction(matches);
    }
}
