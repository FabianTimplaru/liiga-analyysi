import './App.css';
import { useState, useEffect } from 'react';
import type { Match } from './types/Match';
import { MatchCard } from './components/MatchCard';
import type { TeamWins } from './types/TeamWins';
import { TeamWinsList } from './components/TeamWinsList';
import type { AttendanceStats } from './types/AttendanceStats';
import { AttendanceStatsCard } from './components/AttendanceStatsCard';
import type { RefereeStats } from './types/RefereeStats';
import { RefereeStatsList } from './components/RefereeStatsList';

function App() {
  // State variables
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [teams, setTeams] = useState<string[]>([]);
  const [matchLocation, setMatchLocation] = useState<string>("all");
  const [teamWins, setTeamWins] = useState<TeamWins[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [refereeStats, setRefereeStats] = useState<RefereeStats[]>([]);
  const [activeView, setActiveView] = useState<string>("matches");

  // Filter matches based on selected team and match location
  const filteredMatches = matches.filter((match) => {
    if (selectedTeam === "all") {
      return true;
    } else if (matchLocation === "home") {
      return match.home_team === selectedTeam;
    } else if (matchLocation === "away") {
      return match.away_team === selectedTeam;
    } else {
      return match.home_team === selectedTeam || match.away_team === selectedTeam;
    }
  });

  // Filter team wins based on selected team
  const filteredTeamWins = teamWins.filter((teamWin) => {
    if (selectedTeam === "all") {
      return true;
    } else {
      return teamWin.team === selectedTeam;
    }
  });

  // Fetch matches and teams data from the backend API
  useEffect(() => {
    async function fetchMatches() {
      const response: Response = await fetch('http://localhost:3000/api/matches');
      const matchesData: Match[] = await response.json();
      setMatches(matchesData);
    }
    async function fetchTeams() {
      const response: Response = await fetch('http://localhost:3000/api/teams');
      const teamData: string[] = await response.json();
      setTeams(teamData);
    }
    async function fetchTeamWins() {
      const response: Response = await fetch('http://localhost:3000/api/stats/wins');
      const teamWinsData: TeamWins[] = await response.json();
      setTeamWins(teamWinsData);
    }
    async function fetchAttendanceStats() {
      const response: Response = await fetch('http://localhost:3000/api/stats/attendance');
      if (!response.ok) {
        return;
      }
      const attendanceStatsData: AttendanceStats = await response.json();
      setAttendanceStats(attendanceStatsData);
    }
    async function fetchRefereeStats() {
      const response: Response = await fetch('http://localhost:3000/api/stats/referees');
      const refereeStatsData: RefereeStats[] = await response.json();
      setRefereeStats(refereeStatsData);
    }
    fetchMatches();
    fetchTeams();
    fetchTeamWins();
    fetchAttendanceStats();
    fetchRefereeStats();
  }, []);


  return (
    <main>
      <section id="center">
        <div>
          <h1>Liiga-analyysi</h1>
          <button
            id='matches'
            className={activeView === "matches" ? "active" : ""}
            onClick={() => setActiveView("matches")}>
            Ottelut
          </button>
          <button
            id='stats'
            className={activeView === "stats" ? "active" : ""}
            onClick={() => setActiveView("stats")}>
            Tilastot
          </button>
          <p>
            Liiga-kauden 2025-2026 ottelut ja tilastot
          </p>
        </div>

        {/* Display matches view */}
        {activeView === "matches" && (<>
          <p>Ottelut:{filteredMatches.length} / {matches.length}</p>
          <select value={selectedTeam} onChange={(e) => {
            setSelectedTeam(e.target.value);
            setMatchLocation("all"); // Reset match location when team changes
          }}>
            <option value="all">Kaikki joukkueet</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <select
            value={matchLocation}
            onChange={(e) => setMatchLocation(e.target.value)}
            disabled={selectedTeam === "all"}
          >
            <option value="all">Kaikki</option>
            <option value="home">Kotiottelut</option>
            <option value="away">Vierasottelut</option>
          </select>
          <div className="match">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </>)}

        {/* Display statistics view */}
        {activeView === "stats" && (<div className='stats-grid'>
          {attendanceStats && <AttendanceStatsCard attendanceStats={attendanceStats} />}
          <TeamWinsList teamWins={filteredTeamWins} />
          <RefereeStatsList refereeStats={refereeStats} />
        </div>)}
      </section>

    </main >
  );
}

export default App;