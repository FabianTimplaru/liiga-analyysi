import type { RefereeStats } from "../types/RefereeStats";

interface RefereeStatsProps {
    refereeStats: RefereeStats[];
}

export function RefereeStatsList({ refereeStats }: RefereeStatsProps) {
    return (
        <div className="stats-referees">
            <h2>Tuomaritilastot</h2>
            {refereeStats.map((stats) => (
                <div key={stats.referee}>
                    <p>Tuomari {stats.referee}: {stats.matches} ottelua.</p>
                </div>
            ))}
        </div>
    );
}