import type { Match } from "../types/Match";
import type { TeamStandings } from "../types/TeamStandings";
import { LeagueAttendanceChart } from "./LeagueAttendanceChart";
import { TopFivePointChart } from "./TopFivePointChart";
import { TeamLogo } from "./TeamLogo";

interface HomePageProps {
    matches: Match[];
    teamStandings: TeamStandings[];
    onTeamSelect: (team: TeamStandings) => void;
}

export function HomePage({ matches, teamStandings, onTeamSelect }: HomePageProps) {
    const topFiveTeams: TeamStandings[] = teamStandings.slice(0, 5);
    const totalMatches: number = matches.length;
    const totalTeams: number = teamStandings.length;
    const totalAttendance: number = matches.reduce((acc, curr) => acc + curr.attendance, 0);
    const averageAttendance: number = totalMatches > 0 ? Math.round(totalAttendance / totalMatches) : 0;

    return (
        <div className="homepage">
            <section className="homepage-overview">
                <div className="homepage-stat-card">
                    <p>Ottelut</p>
                    <p>{totalMatches}</p>
                </div>
                <div className="homepage-stat-card">
                    <p>Joukkueet</p>
                    <p>{totalTeams}</p>
                </div>
                <div className="homepage-stat-card">
                    <p>Yleisö yhteensä</p>
                    <p>{totalAttendance.toLocaleString("fi-FI")}</p>
                </div>
                <div className="homepage-stat-card">
                    <p>Yleisökeskiarvo / Ottelu</p>
                    <p>{averageAttendance.toLocaleString("fi-FI")}</p>
                </div>
            </section>

            <section className="homepage-top-five">
                <section className="homepage-standings">
                    <h2>Top 5</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Joukkue</th>
                                <th>O</th>
                                <th>P</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topFiveTeams.map((entry, index) => (
                                <tr key={entry.team}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <button type="button" className="team-link" onClick={() => onTeamSelect(entry)}>
                                            <TeamLogo team={entry.team} />
                                            {entry.team}
                                        </button>
                                    </td>
                                    <td>{entry.matches}</td>
                                    <td>{entry.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <TopFivePointChart matches={matches} topFiveTeams={topFiveTeams} />
            </section>
            <LeagueAttendanceChart matches={matches} />

        </div>
    );
}