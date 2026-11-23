import type { RefereeStats } from "../types/RefereeStats";

interface RefereeStatsProps {
    refereeStats: RefereeStats[];
}

export function RefereeStatsList({ refereeStats }: RefereeStatsProps) {
    return (
        <div className="stats-referees">
            <table>
                <thead>
                    <tr>
                        <th>Sija</th>
                        <th>Nimi</th>
                        <th>Ottelut</th>
                    </tr>
                </thead>

                <tbody>
                    {refereeStats.map((stats, index) => (
                        <tr key={stats.referee}>
                            <td>{index + 1}</td>
                            <td>{stats.referee}</td>
                            <td>{stats.matches}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}