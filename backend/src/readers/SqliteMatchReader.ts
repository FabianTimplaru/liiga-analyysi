import type { MatchReader } from './MatchReader';
import type { Match } from '../models/Match';
import { db } from '../db/database';

export class SqliteMatchReader implements MatchReader {
    getAllMatches(): Match[] {
        const allMatches = db.prepare(`SELECT * FROM matches ORDER BY date ASC`).all() as Match[];
        return allMatches;
    }

    getMatchById(id: number): Match | undefined {
        const matchById = db.prepare(`SELECT * FROM matches WHERE id = ?`).get(id) as Match | undefined;
        return matchById;
    }
}