import type { Match } from "../types/Match";
import { TeamLogo } from "./TeamLogo";

interface MatchCardProps {
    match: Match;
    onTeamSelect: (teamName: string) => void;
}

export function MatchCard({ match, onTeamSelect }: MatchCardProps) {
    let matchType = "";
    if (['KJ', 'VJ'].includes(match.result)) {
        matchType = 'JA';
    } else if (['RLK', 'RLV'].includes(match.result)) {
        matchType = 'VL';
    }

    return (
        <div className="match-card">
            <button
                type="button"
                className="home-team team-link"
                onClick={() => onTeamSelect(match.home_team)}
            >
                <TeamLogo team={match.home_team} />
                {match.home_team}
            </button>
            <div>
                <p>{match.home_goals} : {match.away_goals}</p>
                {(matchType) && <p>{matchType}</p>}
            </div>
            <button
                type="button"
                className="away-team team-link"
                onClick={() => onTeamSelect(match.home_team)}
            >
                {match.away_team}
                <TeamLogo team={match.away_team} />
            </button>
            <p>{match.attendance.toLocaleString("fi-FI")}</p>
        </div>
    );
}