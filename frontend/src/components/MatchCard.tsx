import type { Match } from "../types/Match";

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    return (
        <div>
            <p>Päivämäärä: {match.date}</p>
            <p>Kotijoukkue: {match.home_team}</p>
            <p>Vierasjoukkue: {match.away_team}</p>
            <p>Tulos: {match.home_goals} : {match.away_goals}</p>
        </div>
    );
}