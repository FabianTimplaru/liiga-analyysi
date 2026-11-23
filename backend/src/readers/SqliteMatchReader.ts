import type { MatchReader } from './MatchReader';
import type { Match } from '../models/Match';
import { db } from '../db/database';
import { AttendanceStats } from '../models/AttendanceStats';
import { RefereeStats } from '../models/RefereeStats';
import { TeamStandings } from '../models/TeamStandings';

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


    getTeamStandings(): TeamStandings[] {
        const teamStandings = db.prepare(`
            SELECT
            team, COUNT(*) AS matches,
            SUM(regulationWins) AS regulationWins,
            SUM(overtimeWins) AS overtimeWins,
            SUM(regulationLosses) AS regulationLosses,
            SUM(overtimeLosses) AS overtimeLosses,
            SUM(goalsFor) AS goalsFor,
            SUM(goalsAgainst) AS goalsAgainst,
            SUM(regulationWins) * 3 + SUM(overtimeWins) * 2 + SUM(overtimeLosses) AS points
            FROM 
            (SELECT home_team AS team, home_goals AS goalsFor, away_goals AS goalsAgainst,
            CASE WHEN result ='K' THEN 1 ELSE 0 END AS regulationWins,
            CASE WHEN result IN ('KJ', 'RLK') THEN 1 ELSE 0 END AS overtimeWins,
            CASE WHEN result = 'V' THEN 1 ELSE 0 END AS regulationLosses,
            CASE WHEN result IN ('VJ','RLV') THEN 1 ELSE 0 END AS overtimeLosses
            FROM matches
            UNION ALL
            SELECT away_team AS team, away_goals AS goalsFor, home_goals AS goalsAgainst,
            CASE WHEN result = 'V' THEN 1 ELSE 0 END AS regulationWins,
            CASE WHEN result IN ('VJ','RLV') THEN 1 ELSE 0 END AS overtimeWins,
            CASE WHEN result = 'K' THEN 1 ELSE 0 END AS regulationLosses,
            CASE WHEN result IN ('KJ','RLK') THEN 1 ELSE 0 END AS overtimeLosses
            FROM matches) AS combined
            GROUP BY team
            ORDER BY points DESC,regulationWins DESC, SUM(goalsFor) - SUM(goalsAgainst) DESC, goalsFor DESC
            `).all() as TeamStandings[];
        return teamStandings;
    }

    getAttendanceStats(): AttendanceStats | undefined {
        const attendanceStats = db.prepare(`
            SELECT 
            ROUND(AVG(attendance)) AS average,
            MIN(attendance) AS lowest,
            MAX(attendance) AS highest
            FROM matches HAVING COUNT(*) > 0
            `).get() as Pick<AttendanceStats, 'average' | 'lowest' | 'highest'> | undefined;

        if (!attendanceStats) {
            return undefined;
        }

        const lowestMatch = db.prepare(`
            SELECT * FROM matches ORDER BY attendance ASC LIMIT 1
            `).get() as Match;
        const highestMatch = db.prepare(`
            SELECT * FROM matches ORDER BY attendance DESC LIMIT 1
            `).get() as Match;
        return {
            ...attendanceStats,
            lowestMatch,
            highestMatch
        };
    }

    getRefereeStats(): RefereeStats[] {
        const refereeStats = db.prepare(`
            SELECT referee, COUNT(*) AS matches FROM matches
            GROUP BY referee
            ORDER BY matches DESC
            `).all() as RefereeStats[];
        return refereeStats;
    }
}