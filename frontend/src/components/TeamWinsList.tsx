import type { TeamWins } from "../types/TeamWins";

interface TeamWinsListProps {
    teamWins: TeamWins[];
}

export function TeamWinsList({ teamWins }: TeamWinsListProps) {
    return (
        <div className="stats-wins">
            <h2>Joukkueiden voitot</h2>
            {teamWins.map((teamWin) => (
                <div key={teamWin.team}>
                    <p>{teamWin.team}: {teamWin.wins} voittoa</p>
                </div>
            ))}
        </div>
    );
}