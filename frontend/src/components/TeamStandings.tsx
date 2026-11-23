import { useLayoutEffect, useRef } from "react";
import type { TeamStandings } from "../types/TeamStandings";

interface TeamStandingsProps {
    teamStandings: TeamStandings[];
    onTeamSelect: (team: TeamStandings) => void;
}

export function TeamStandingsList({ teamStandings, onTeamSelect }: TeamStandingsProps) {
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const tableHeaderRef = useRef<HTMLTableSectionElement>(null);

    useLayoutEffect(() => {
        const tableScroll = tableScrollRef.current;
        const tableHeader = tableHeaderRef.current;
        if (!tableScroll || !tableHeader) return;

        const updateHeaderTop = () => {
            // Sticky positioning uses the horizontal scroller as its scrollport.
            const top = Math.max(0, -tableScroll.getBoundingClientRect().top);
            tableHeader.style.top = `${top}px`;
        };

        updateHeaderTop();
        window.addEventListener("scroll", updateHeaderTop, { passive: true });
        window.addEventListener("resize", updateHeaderTop);

        return () => {
            window.removeEventListener("scroll", updateHeaderTop);
            window.removeEventListener("resize", updateHeaderTop);
        };
    }, []);

    return (
        <div className="stats-standings">
            <div className="table-scroll" ref={tableScrollRef}>
                <table>
                    <thead ref={tableHeaderRef}>
                        <tr>
                            <th>#</th>
                            <th>Joukkue</th>
                            <th>O</th>
                            <th>V</th>
                            <th>JV</th>
                            <th>JH</th>
                            <th>H</th>
                            <th>TM</th>
                            <th>PM</th>
                            <th>P</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teamStandings.map((standings, index) => (
                            <tr key={standings.team}>
                                <td>{index + 1}</td>
                                <td>
                                    <button type="button" className="team-link" onClick={() => onTeamSelect(standings)}>
                                        {standings.team}
                                    </button>
                                </td>
                                <td>{standings.matches}</td>
                                <td>{standings.regulationWins}</td>
                                <td>{standings.overtimeWins}</td>
                                <td>{standings.overtimeLosses}</td>
                                <td>{standings.regulationLosses}</td>
                                <td>{standings.goalsFor}</td>
                                <td>{standings.goalsAgainst}</td>
                                <td>{standings.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
