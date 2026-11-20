import type { Match } from "./Match";

export interface AttendanceStats {
    average: number;
    highest: number;
    lowest: number;
    lowestMatch: Match;
    highestMatch: Match;
}