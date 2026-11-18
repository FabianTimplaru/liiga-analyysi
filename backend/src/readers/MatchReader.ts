import type { Match } from '../models/Match';

export interface MatchReader {
    getAllMatches(): Match[];
    getMatchById(id: number): Match | undefined;
}