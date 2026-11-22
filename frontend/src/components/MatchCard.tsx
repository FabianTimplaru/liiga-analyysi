import type { Match } from "../types/Match";

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    return (
        <div className="match-card">
            <p>Päivämäärä: {new Date(match.date).toLocaleDateString("fi-FI")}</p>
            <p>Kotijoukkue: {match.home_team}</p>
            <p>Vierasjoukkue: {match.away_team}</p>
            <p>Tulos: {match.home_goals} : {match.away_goals}</p>
        </div>
    );
}