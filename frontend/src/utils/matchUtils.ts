import type { Match } from "../types/Match";

export function getMatchPoints(match: Match, team: string): number {
    let pointsEarned = 0;

    if (match.home_team === team) {
        switch (match.result) {
            case 'K':
                pointsEarned = 3;
                break;
            case 'KJ':
            case 'RLK':
                pointsEarned = 2;
                break;
            case 'VJ':
            case 'RLV':
                pointsEarned = 1;
                break;
            case 'V':
                pointsEarned = 0;
                break;
        }
    } else if (match.away_team === team) {
        switch (match.result) {
            case 'K':
                pointsEarned = 0;
                break;
            case 'KJ':
            case 'RLK':
                pointsEarned = 1;
                break;
            case 'VJ':
            case 'RLV':
                pointsEarned = 2;
                break;
            case 'V':
                pointsEarned = 3;
                break;
        }
    }
    return pointsEarned;
}

export const formatDate = (date: string): string => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year.slice(-2)}`;
};