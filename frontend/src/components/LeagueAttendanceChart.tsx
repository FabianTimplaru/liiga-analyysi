import type { Match } from "../types/Match";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { formatDate } from "../utils/matchUtils";

interface LeagueAttendanceChartProps {
    matches: Match[];
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export function LeagueAttendanceChart({ matches }: LeagueAttendanceChartProps) {
    const attendanceByDateData = matches.reduce<Record<string, number>>((acc, match) => {

        if (acc[match.date] === undefined) {
            acc[match.date] = 0;
        }
        acc[match.date] += match.attendance;
        return acc;
    }, {});

    const attendanceByDate = Object.entries(attendanceByDateData).map(([date, attendance]) => ({
        date,
        attendance
    })).sort((a, b) => a.date.localeCompare(b.date));

    const chartData = {
        labels: attendanceByDate.map((data) => formatDate(data.date)),
        datasets: [{
            label: "Yleisömäärä",
            data: attendanceByDate.map((data) => data.attendance),
            borderColor: "#2563eb",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2
        }]
    };
    return (
        <section className="homepage-attendance">
            <h2>Liigan yleisömäärä</h2>
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
                                ticks: { autoSkip: true, maxTicksLimit: 12, maxRotation: 0, autoSkipPadding: 10 }
                            },
                            y: {
                                beginAtZero: false,
                                grace: "10%"
                            }
                        },
                        plugins: {
                            legend: { display: false },
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
                    }} />
            </div>
        </section >
    );
}

