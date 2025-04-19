import { useState } from 'react';
import './TeamInput.css';

function TeamInput({ onSubmit }) {
  const [teamInput, setTeamInput] = useState('');
  const [teamsList, setTeamsList] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setTeamInput(e.target.value);
  };

  const addTeam = () => {
    if (!teamInput.trim()) {
      setError('Team name cannot be empty');
      return;
    }

    if (teamsList.includes(teamInput.trim())) {
      setError('Team name already exists');
      return;
    }

    setTeamsList([...teamsList, teamInput.trim()]);
    setTeamInput('');
    setError('');
  };

  const removeTeam = (index) => {
    const updatedTeams = [...teamsList];
    updatedTeams.splice(index, 1);
    setTeamsList(updatedTeams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (teamsList.length < 2) {
      setError('You need at least 2 teams');
      return;
    }
    
    onSubmit(teamsList);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTeam();
    }
  };

  const addSampleTeams = () => {
    const sampleTeams = [
      'Chennai Super Kings', 
      'Mumbai Indians', 
      'Kolkata Knight Riders', 
      'Royal Challengers Bengaluru', 
      'Delhi Capitals', 
      'Rajasthan Royals', 
      'Sunrisers Hyderabad', 
      'Gujarat Titans', 
      'Lucknow Super Giants', 
      'Punjab Kings'
    ];
    setTeamsList(sampleTeams);
    setError('');
  };
  

  return (
    <div className="team-input-container">
      <h2>Enter Teams</h2>
      
      <div className="input-row">
        <input
          type="text"
          value={teamInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter team name"
          className="team-text-input"
        />
        <button onClick={addTeam} className="add-team-button">Add Team</button>
        <button onClick={addSampleTeams} className="sample-teams-button">Use Sample Teams</button>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      {teamsList.length > 0 && (
        <div className="teams-list-container">
          <h3>Teams ({teamsList.length})</h3>
          <ul className="teams-list">
            {teamsList.map((team, index) => (
              <li key={index} className="team-item">
                <span>{team}</span>
                <button 
                  onClick={() => removeTeam(index)}
                  className="remove-team-button"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={handleSubmit}
            className="confirm-teams-button"
            disabled={teamsList.length < 2}
          >
            Confirm Teams
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamInput;
