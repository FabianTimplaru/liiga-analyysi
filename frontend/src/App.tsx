import './App.css';
import { useState, useEffect } from 'react';
import type { Match } from './types/Match';
import { MatchCard } from './components/MatchCard';
import type { TeamWins } from './types/TeamWins';
import { TeamWinsList } from './components/TeamWinsList';

function App() {
  // State variables
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [teams, setTeams] = useState<string[]>([]);
  const [matchLocation, setMatchLocation] = useState<string>("all");
  const [teamWins, setTeamWins] = useState<TeamWins[]>([]);

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
    fetchMatches();
    fetchTeams();
    fetchTeamWins();
  }, []);


  return (
    <main>
      <section id="center">
        <div>
          <h1>Liiga-analyysi</h1>
          <p>
            Liiga-kauden 2025-2026 ottelut ja tilastot
          </p>
          <p>Ottelut:{filteredMatches.length} / {matches.length}</p>
        </div>
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
        <TeamWinsList teamWins={filteredTeamWins} />
      </section>

    </main >
  );
}

export default App;