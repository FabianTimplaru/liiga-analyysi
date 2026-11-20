import './App.css';
import { useState, useEffect } from 'react';
import type { Match } from './types/Match';
import { MatchCard } from './components/MatchCard';

function App() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      const response: Response = await fetch('http://localhost:3000/api/matches');
      const matchesData: Match[] = await response.json();
      setMatches(matchesData);
    }
    fetchMatches();
  }, []);


  return (
    <main>
      <section id="center">
        <div>
          <h1>Liiga-analyysi</h1>
          <p>
            Liiga-kauden 2025–2026 ottelut ja tilastot
          </p>
          <p>Total matches: {matches.length}</p>
        </div>
        <div className="match">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

    </main >
  );
}

export default App;