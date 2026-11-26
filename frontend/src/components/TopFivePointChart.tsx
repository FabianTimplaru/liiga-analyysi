import type { Match } from "../types/Match";
import type { TeamStandings } from "../types/TeamStandings";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { getMatchPoints } from "../utils/matchUtils";
import { formatDate } from "../utils/matchUtils";

interface TopFivePointChartProps {
    matches: Match[];
    topFiveTeams: TeamStandings[];
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const teamColors: string[] = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#9333ea"];

export function TopFivePointChart({ matches, topFiveTeams }: TopFivePointChartProps) {
    const sortedDates: string[] = [...new Set(matches.map((match) => match.date))].sort((a, b) => a.localeCompare(b));

    const dataSets = topFiveTeams.map((team, index) => {
        const pointsByDate = matches.reduce<Record<string, number>>((acc, match) => {
            acc[match.date] = (acc[match.date] ?? 0) + getMatchPoints(match, team.team);
            return acc;
        }, {});
        let totalPoints = 0;
        const cumulativePoints = sortedDates.map((date) => (
            totalPoints += (pointsByDate[date] ?? 0)
        ));

        return {
            label: team.team,
            data: cumulativePoints,
            borderColor: teamColors[index],
            backgroundColor: teamColors[index],
            borderWidth: 2,
            pointRadius: 0,
            tension: 0
        };
    });

    const chartData = {
        labels: sortedDates.map((date) => formatDate(date)),
        datasets: dataSets
    };

    return (
        <section className="homepage-points">
            <h2>Top 5 - Pistekehitys</h2>
            <div className="chart-container">
                <Line data={chartData}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        locale: "fi-FI",
                        interaction: {
                            mode: "index",
                            intersect: false
                        },
                        scales: {
                            x: {
                                ticks: { autoSkip: true, maxTicksLimit: 10, maxRotation: 0, autoSkipPadding: 10 }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: { precision: 0 }
                            }
                        },
                        plugins: {
                            legend: { display: true, position: "top" },
                            tooltip: {
                                enabled: true,
                                displayColors: true,
                            }
                        }
                    }} />
            </div>
        </section>
    );
}