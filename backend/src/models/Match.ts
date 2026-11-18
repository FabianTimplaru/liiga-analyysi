// This file defines the Match interface, which represents a match record in the database.
export interface Match {
    id?: number;
    date: string;
    home_team: string;
    away_team: string;
    home_goals: number;
    away_goals: number;
    result: string;
    referee: string;
    attendance: number;
}