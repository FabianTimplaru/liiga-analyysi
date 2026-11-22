import type { AttendanceStats } from "../types/AttendanceStats";

interface AttendanceStatsProps {
    attendanceStats: AttendanceStats;
}

export function AttendanceStatsCard({ attendanceStats }: AttendanceStatsProps) {
    return (
        <div className="stats-attendance">
            <h2>Yleisötilastot</h2>
            <p>Keskimääräinen yleisömäärä: {attendanceStats.average.toLocaleString("fi-FI")}</p>
            <p>Pienin yleisömäärä: {attendanceStats.lowest.toLocaleString("fi-FI")}</p>
            <p>Ottelu:{" "}
                {new Date(attendanceStats.lowestMatch.date).toLocaleDateString("fi-FI")}:{" "}
                {attendanceStats.lowestMatch.home_team}{" "}
                {attendanceStats.lowestMatch.home_goals} - {attendanceStats.lowestMatch.away_goals} {" "}
                {attendanceStats.lowestMatch.away_team}
            </p>

            <p>Suurin yleisömäärä: {attendanceStats.highest.toLocaleString("fi-FI")}</p>
            <p>
                Ottelu:{" "}
                {new Date(attendanceStats.highestMatch.date).toLocaleDateString("fi-FI")}:{" "}
                {attendanceStats.highestMatch.home_team}{" "}
                {attendanceStats.highestMatch.home_goals} - {attendanceStats.highestMatch.away_goals}{" "}
                {attendanceStats.highestMatch.away_team}
            </p>
        </div>
    );
}