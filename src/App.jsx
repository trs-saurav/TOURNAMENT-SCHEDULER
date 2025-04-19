import { useState, useEffect } from 'react';
import './App.css';
import TeamInput from './components/TeamInput';
import Schedule from './components/Schedule';
import { generateSchedule } from './utils/scheduler';



function App() {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [homeAwayBalance, setHomeAwayBalance] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTeamsSubmit = (teamsList) => {
    setTeams(teamsList);
    setSchedule(null);
    setHomeAwayBalance({});
    setError(null);
  };

  const generateTournamentSchedule = () => {
    if (teams.length < 2) {
      setError("You need at least 2 teams to create a schedule");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Use setTimeout to prevent UI freezing during calculation
    setTimeout(() => {
      try {
        const result = generateSchedule(teams);
        setSchedule(result.schedule);
        setHomeAwayBalance(result.homeAwayBalance);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to generate schedule: " + err.message);
        setIsLoading(false);
      }
    }, 100);
  };

  const exportToCSV = () => {
    if (!schedule) return;

    let csvContent = "Round,Home Team,Away Team,Venue\n";
    
    schedule.forEach((round, roundIndex) => {
      round.forEach(match => {
        const homeName = match.home === "BYE" ? "BYE" : teams[match.home];
        const awayName = match.away === "BYE" ? "BYE" : teams[match.away];
        const venue = match.home === "BYE" || match.away === "BYE" ? "N/A" : `${homeName}'s venue`;
        
        csvContent += `${roundIndex + 1},${homeName},${awayName},${venue}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'tournament_schedule.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <h1>Tournament Scheduler</h1>
      <p className="app-description">
        Create a round-robin tournament schedule where each team plays against every other team.
        Uses backtracking algorithm to generate an optimal schedule.
      </p>

      <TeamInput onSubmit={handleTeamsSubmit} />

      {teams.length > 0 && (
        <div className="action-container">
          <button 
            onClick={generateTournamentSchedule} 
            disabled={isLoading || teams.length < 2}
            className="generate-button"
          >
            {isLoading ? 'Generating...' : 'Generate Schedule'}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {schedule && (
        <>
          <Schedule 
            schedule={schedule} 
            teams={teams} 
            homeAwayBalance={homeAwayBalance} 
          />
          
          <div className="export-container">
            <button onClick={exportToCSV} className="export-button">
              Export to CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
