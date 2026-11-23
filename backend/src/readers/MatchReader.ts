import type { AttendanceStats } from '../models/AttendanceStats';
import type { Match } from '../models/Match';
import type { RefereeStats } from '../models/RefereeStats';
import { TeamStandings } from '../models/TeamStandings';

export interface MatchReader {
    getAllMatches(): Match[];
    getMatchById(id: number): Match | undefined;
    getTeams(): string[];
    getTeamStandings(): TeamStandings[];
    getAttendanceStats(): AttendanceStats | undefined;
    getRefereeStats(): RefereeStats[];
}