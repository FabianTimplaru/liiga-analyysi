// This interface represents a match received from the backend API
export interface Match {
    id: number;
    date: string;
    home_team: string;
    away_team: string;
    home_goals: number;
    away_goals: number;
    result: string;
    referee: string;
    attendance: number;
}