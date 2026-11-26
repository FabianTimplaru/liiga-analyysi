import type { Match } from "../types/Match";
import type { TeamStandings } from "../types/TeamStandings";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { getMatchPoints } from "../utils/matchUtils";
import { formatDate } from "../utils/matchUtils";

interface TopFivePointChartProps {
    matches: Match[];
    topFiveTeams: TeamStandings[];
}

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

        return { label: team.team, data: cumulativePoints, borderColor: teamColors[index] };
    });

    const chartData = {
        labels: sortedDates.map((date) => formatDate(date)),
        dataSets: dataSets
    };
}