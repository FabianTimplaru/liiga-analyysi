import './App.css';
import { useState, useEffect } from 'react';
import type { Match } from './types/Match';
import { MatchCard } from './components/MatchCard';
import type { RefereeStats } from './types/RefereeStats';
import { RefereeStatsList } from './components/RefereeStatsList';
import type { TeamStandings } from './types/TeamStandings';
import { TeamStandingsList } from './components/TeamStandings';
import { TeamStatsModal } from './components/TeamStatsModal';
import { HomePage } from './components/HomePage';

const formatMatchDate = (date: string): string => {
  return new Intl.DateTimeFormat('fi-FI', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date)).toUpperCase();
};

function App() {
  // State variables
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [teams, setTeams] = useState<string[]>([]);
  const [matchLocation, setMatchLocation] = useState<string>("all");
  const [teamStandings, setTeamStandings] = useState<TeamStandings[]>([]);
  const [refereeStats, setRefereeStats] = useState<RefereeStats[]>([]);
  const [activeView, setActiveView] = useState<string>("overview");
  const [activeStatsView, setActiveStatsView] = useState<string>("standings");
  const [selectedStatsTeam, setSelectedStatsTeam] = useState<TeamStandings | null>(null);

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

  const sortedMatches = [...filteredMatches].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const matchesByDate = sortedMatches.reduce<Record<string, Match[]>>((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {});

  const handleTeamSelect = (teamName: string) => {
    const team = teamStandings.find(
      (entry) => entry.team === teamName
    );

    if (team) {
      setSelectedStatsTeam(team);
    }
  };

  // Fetch matches and teams data from the backend API
  useEffect(() => {
    async function fetchMatches() {
      const response: Response = await fetch('/api/matches');
      const matchesData: Match[] = await response.json();
      setMatches(matchesData);
    }
    async function fetchTeams() {
      const response: Response = await fetch('/api/teams');
      const teamData: string[] = await response.json();
      setTeams(teamData);
    }
    async function fetchTeamStandings() {
      const response: Response = await fetch('/api/stats/standings');
      const teamStandingsData: TeamStandings[] = await response.json();
      setTeamStandings(teamStandingsData);
    }
    async function fetchRefereeStats() {
      const response: Response = await fetch('/api/stats/referees');
      const refereeStatsData: RefereeStats[] = await response.json();
      setRefereeStats(refereeStatsData);
    }
    fetchMatches();
    fetchTeams();
    fetchTeamStandings();
    fetchRefereeStats();
  }, []);


  return (
    <>
      <header className="main-header">
        <nav className="main-nav">
          <button className="nav-brand" onClick={() => setActiveView("overview")}>
            Liiga
          </button>
          <button
            id='overview'
            className={activeView === "overview" ? "active" : ""}
            onClick={() => setActiveView("overview")}>
            Etusivu
          </button>

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
        </nav>
      </header>

      <main>
        <section id="center">
          {/*Display homepage view*/}
          {activeView === "overview" && (
            <HomePage matches={matches}
              teamStandings={teamStandings}
              onTeamSelect={setSelectedStatsTeam} />)}

          {/* Display matches view */}
          {activeView === "matches" && (<>
            <div className='matches-toolbar'>
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
              <p>Ottelut: {filteredMatches.length} / {matches.length}</p>
            </div>

            <div className="match">
              {Object.entries(matchesByDate).map(([date, matches]) => (
                <div key={date} className='match-date-group'>
                  <h2 className='match-header'>{formatMatchDate(date)}</h2>
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} onTeamSelect={handleTeamSelect} />
                  ))}
                </div>
              ))}
            </div>
          </>)}

          {/* Display statistics view */}
          {activeView === "stats" && (<div className='stats-grid'>
            <nav className="stats-nav">
              <button
                onClick={() => setActiveStatsView("standings")}
                className={activeStatsView === "standings" ? "active" : ""}>
                Sarjataulukko
              </button>
              <button
                onClick={() => setActiveStatsView("referees")}
                className={activeStatsView === "referees" ? "active" : ""}>
                Tuomaritilastot
              </button>
            </nav>
            {activeStatsView === "standings" &&
              <TeamStandingsList teamStandings={teamStandings} onTeamSelect={setSelectedStatsTeam} />}
            {activeStatsView === "referees" && <RefereeStatsList refereeStats={refereeStats} />}
          </div>)}
        </section>

        {selectedStatsTeam && (
          <TeamStatsModal
            team={selectedStatsTeam}
            rank={teamStandings.findIndex(
              (team) => team.team === selectedStatsTeam.team
            ) + 1}
            onClose={() => setSelectedStatsTeam(null)}
            matches={matches}
          />
        )}
      </main >
      <footer className="main-footer">
        <p>Liiga-analyysi</p>
        <p>Liiga-kausi 2025-2026</p>
        <p>Opiskelijaprojekti · Ei Liigan virallinen verkkosivusto</p>
      </footer>
    </>
  );
}

export default App;