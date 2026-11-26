import type { TeamStandings } from "../types/TeamStandings";
import type { Match } from "../types/Match";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";
import { getMatchPoints, formatDate } from "../utils/matchUtils";

interface TeamStatsModalProps {
    team: TeamStandings;
    matches: Match[];
    onClose: () => void;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export function TeamStatsModal({ team, onClose, matches }: TeamStatsModalProps) {
    const teamMatches: Match[] = matches.filter(
        (match) => match.home_team === team.team || match.away_team === team.team
    ).sort((a, b) => a.date.localeCompare(b.date));

    const homeMatches: Match[] = teamMatches.filter(
        (match) => match.home_team === team.team
    );

    const matchPoints: { date: string; pointsEarned: number; }[] = teamMatches.map((match) => {
        return {
            date: match.date,
            pointsEarned: getMatchPoints(match, team.team)
        };
    });

    const cumulativePoints = matchPoints.reduce<
        { date: string; totalPoints: number; }[]
    >((acc, curr) => {
        const previousTotal = acc.at(-1)?.totalPoints ?? 0;

        acc.push({
            date: curr.date,
            totalPoints: previousTotal + curr.pointsEarned
        });

        return acc;
    }, []);

    const pointsChartData = {
        labels: cumulativePoints.map((data) => formatDate(data.date)),
        datasets: [
            {
                label: "Pistekehitys",
                data: cumulativePoints.map((data) => data.totalPoints),
                pointRadius: 0,
                borderColor: "#2563eb",
                borderWidth: 2,
                tension: 0
            }
        ]
    };

    const attendanceData: { date: string; attendance: number; }[] = homeMatches.map(
        (match) => ({ date: match.date, attendance: match.attendance }
        ));

    const attendanceChartData = {
        labels: attendanceData.map((data) => formatDate(data.date)),
        datasets: [
            {
                label: "Yleisömäärä",
                data: attendanceData.map((data) => data.attendance),
                borderColor: "#2563eb",
                tension: 0.3
            }
        ]
    };

    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
            if (e.key === "Tab") {
                e.preventDefault();
                closeButtonRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        const previouslyFocusedElement = document.activeElement;
        closeButtonRef.current?.focus();

        return () => {
            if (previouslyFocusedElement instanceof HTMLElement) {
                previouslyFocusedElement.focus();
            }
        };
    }, []);

    useEffect(() => {
        const currentOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = currentOverflow;
        };
    }, []);

    return (
        <div className="modal-backdrop" onClick={() => onClose()}>
            <div
                className="team-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog" aria-modal={true} aria-label={`${team.team} tilastot`}
            >
                <div className="team-modal-header">
                    <button ref={closeButtonRef} type="button" aria-label="Sulje" onClick={onClose}>x</button>
                </div>
                <div className="team-modal-table">
                    <table className="team-modal-stats">
                        <thead>
                            <tr>
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
                            <tr>
                                <td>{team.team}</td>
                                <td>{team.matches}</td>
                                <td>{team.regulationWins}</td>
                                <td>{team.overtimeWins}</td>
                                <td>{team.overtimeLosses}</td>
                                <td>{team.regulationLosses}</td>
                                <td>{team.goalsFor}</td>
                                <td>{team.goalsAgainst}</td>
                                <td>{team.points}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="team-modal-graphs">
                    <div className="attendance-graph">
                        <h3>Yleisömäärä</h3>
                        <Line
                            options={{
                                aspectRatio: 1.6,
                                scales: {
                                    x: {
                                        ticks: { autoSkip: true, maxTicksLimit: 8 }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        enabled: true,
                                        displayColors: false,
                                        callbacks: {
                                            label: function (context) {
                                                return `${(context.parsed.y)!.toLocaleString("fi-FI")} katsojaa`;
                                            }
                                        }
                                    }
                                }
                            }}
                            data={attendanceChartData} />
                    </div>
                    <div className="points-graph">
                        <h3>Pistekehitys</h3>
                        <Line
                            options={{
                                aspectRatio: 1.6,
                                scales: {
                                    x: {
                                        ticks: { autoSkip: true, maxTicksLimit: 8 }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            precision: 0
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        enabled: true,
                                        displayColors: false,
                                        callbacks: {
                                            label: function (context) {
                                                return `Pisteet: ${context.parsed.y}`;
                                            }
                                        }
                                    }
                                }
                            }}
                            data={pointsChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};