import type { MatchReader } from './MatchReader';
import type { Match } from '../models/Match';
import { db } from '../db/database';
import type { TeamWins } from '../models/TeamWins';

export class SqliteMatchReader implements MatchReader {
    getAllMatches(): Match[] {
        const allMatches = db.prepare(`SELECT * FROM matches ORDER BY date ASC`).all() as Match[];
        return allMatches;
    }

    getMatchById(id: number): Match | undefined {
        const matchById = db.prepare(`SELECT * FROM matches WHERE id = ?`).get(id) as Match | undefined;
        return matchById;
    }

    getTeams(): string[] {
        const allTeams = db.prepare(`
            SELECT home_team AS team FROM matches
            UNION
            SELECT away_team AS team FROM matches
            ORDER BY team ASC
            `).all() as { team: string; }[];
        return allTeams.map(teamObj => teamObj.team);
    }

    getTeamWins(): TeamWins[] {
        const teamWins = db.prepare(`
            SELECT team, SUM(wins) AS wins FROM
            (SELECT home_team AS team, COUNT(*) AS wins FROM matches
            WHERE result in ('K', 'KJ', 'RLK')
            GROUP BY home_team
            UNION ALL
            SELECT away_team AS team, COUNT(*) AS wins FROM matches
            WHERE result in ('V', 'VJ', 'RLV')
            GROUP BY away_team) AS combined
            GROUP BY team
            ORDER BY wins DESC
            `).all() as TeamWins[];
        return teamWins;
    }
}