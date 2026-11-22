import type { TeamWins } from "../types/TeamWins";

interface TeamWinsListProps {
    teamWins: TeamWins[];
}

export function TeamWinsList({ teamWins }: TeamWinsListProps) {
    return (
        <div className="stats-wins">
            <h2>Joukkueiden voitot</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sija</th>
                        <th>Joukkue</th>
                        <th>Voitot</th>
                    </tr>
                </thead>

                <tbody>
                    {teamWins.map((teamWin, index) => (
                        <tr key={teamWin.team}>
                            <td>{index + 1}</td>
                            <td>{teamWin.team}</td>
                            <td>{teamWin.wins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}