import './Schedule.css';

function Schedule({ schedule, teams, homeAwayBalance }) {
  if (!schedule || schedule.length === 0) {
    return <div>No schedule available</div>;
  }

  return (
    <div className="schedule-container">
      <h2>Tournament Schedule</h2>
      
      {schedule.map((round, roundIndex) => (
        <div key={roundIndex} className="round-container">
          <h3>Round {roundIndex + 1}</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {round.map((match, matchIndex) => {
                const homeName = match.home === "BYE" ? "BYE" : teams[match.home];
                const awayName = match.away === "BYE" ? "BYE" : teams[match.away];
                const venue = match.home === "BYE" || match.away === "BYE" 
                  ? "N/A" 
                  : `${homeName}'s venue`;
                
                return (
                  <tr key={matchIndex}>
                    <td className={match.home === "BYE" ? "bye-team" : ""}>
                      {homeName}
                    </td>
                    <td className={match.away === "BYE" ? "bye-team" : ""}>
                      {awayName}
                    </td>
                    <td>{venue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <div className="balance-container">
        <h3>Home/Away Balance</h3>
        <table className="balance-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Home Games</th>
              <th>Away Games</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(homeAwayBalance).map((teamIndex) => {
              if (teamIndex === "BYE") return null;
              
              const teamName = teams[parseInt(teamIndex)];
              const balance = homeAwayBalance[teamIndex];
              
              return (
                <tr key={teamIndex}>
                  <td>{teamName}</td>
                  <td>{balance.home}</td>
                  <td>{balance.away}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;
