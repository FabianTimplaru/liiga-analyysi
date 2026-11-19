import type { Match } from '../models/Match';
import { TeamWins } from '../models/TeamWins';

export interface MatchReader {
    getAllMatches(): Match[];
    getMatchById(id: number): Match | undefined;
    getTeams(): string[];
    getTeamWins(): TeamWins[];
}