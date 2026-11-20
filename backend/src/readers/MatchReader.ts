import type { AttendanceStats } from '../models/AttendanceStats';
import type { Match } from '../models/Match';
import type { RefereeStats } from '../models/RefereeStats';
import type { TeamWins } from '../models/TeamWins';

export interface MatchReader {
    getAllMatches(): Match[];
    getMatchById(id: number): Match | undefined;
    getTeams(): string[];
    getTeamWins(): TeamWins[];
    getAttendanceStats(): AttendanceStats | undefined;
    getRefereeStats(): RefereeStats[];
}