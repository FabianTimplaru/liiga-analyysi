import type { Match } from "../types/Match";

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    let matchType = "";
    if (['KJ', 'VJ'].includes(match.result)) {
        matchType = 'JA';
    } else if (['RLK', 'RLV'].includes(match.result)) {
        matchType = 'VL';
    }

    return (
        <div className="match-card">
            <p>{match.home_team}</p>
            <div>
                <p>{match.home_goals} : {match.away_goals}</p>
                {(matchType) && <p>{matchType}</p>}
            </div>
            <p>{match.away_team}</p>
            <p>{match.attendance.toLocaleString("fi-FI")}</p>
        </div>
    );
}