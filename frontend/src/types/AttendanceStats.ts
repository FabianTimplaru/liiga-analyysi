import type { Match } from "./Match";

export interface AttendanceStats {
    average: number;
    lowest: number;
    highest: number;
    lowestMatch: Match;
    highestMatch: Match;
}