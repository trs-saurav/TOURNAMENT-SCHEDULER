
export function generateSchedule(teamNames) {
    const numTeams = teamNames.length;
    
    // Handle odd number of teams by adding a dummy team for byes
    const hasDummy = numTeams % 2 === 1;
    const totalTeams = hasDummy ? numTeams + 1 : numTeams;
    
    // Initialize data structures
    const teams = Array.from({ length: totalTeams }, (_, i) => i);
    const homeGames = {};
    const awayGames = {};
    
    teams.forEach(team => {
      homeGames[team] = 0;
      awayGames[team] = 0;
    });
    
    // Generate all possible games
    const allGames = [];
    for (let home of teams) {
      for (let away of teams) {
        if (home !== away) {
          // Skip games involving the dummy team (if exists)
          if (hasDummy && (home === totalTeams - 1 || away === totalTeams - 1)) {
            continue;
          }
          allGames.push({ home, away });
        }
      }
    }
    
    // Schedule rounds
    const rounds = [];
    const roundsNeeded = totalTeams - 1; // Each team plays against every other team
    let availableGames = [...allGames];
    
    // Helper function to check if a game is valid for a round
    const isValidGameForRound = (game, roundGames) => {
      // Check if either team is already playing in this round
      for (const existingGame of roundGames) {
        if (existingGame.home === game.home || existingGame.home === game.away || 
            existingGame.away === game.home || existingGame.away === game.away) {
          return false;
        }
      }
      
      // Check home/away balance
      const maxImbalance = Math.floor(totalTeams / 4) + 1;
      if ((homeGames[game.home] - awayGames[game.home] >= maxImbalance) ||
          (awayGames[game.away] - homeGames[game.away] >= maxImbalance)) {
        return false;
      }
      
      return true;
    };
    
    // Backtracking function to schedule a round
    const scheduleRound = (availableGames, currentRound) => {
      const gamesPerRound = Math.floor(totalTeams / 2);
      
      // Base case: round is complete
      if (currentRound.length === gamesPerRound) {
        // Update home/away counts
        currentRound.forEach(game => {
          homeGames[game.home]++;
          awayGames[game.away]++;
        });
        
        return true;
      }
      
      // Try each available game for this position in the round
      for (let i = 0; i < availableGames.length; i++) {
        const game = availableGames[i];
        
        if (isValidGameForRound(game, currentRound)) {
          // Add this game to the current round
          currentRound.push(game);
          
          // Remove this game from available games
          const remainingGames = [
            ...availableGames.slice(0, i),
            ...availableGames.slice(i + 1)
          ];
          
          // Recursively schedule the rest of the round
          if (scheduleRound(remainingGames, currentRound)) {
            return true;
          }
          
          // Backtrack: remove the game and try another
          currentRound.pop();
        }
      }
      
      return false;
    };
    
    // Schedule each round
    for (let i = 0; i < roundsNeeded; i++) {
      const currentRound = [];
      
      if (scheduleRound(availableGames, currentRound)) {
        rounds.push([...currentRound]);
        
        // Update available games by removing scheduled games
        for (const game of currentRound) {
          availableGames = availableGames.filter(g => 
            !(g.home === game.home && g.away === game.away)
          );
        }
      } else {
        throw new Error("Failed to schedule round " + (i + 1));
      }
    }
    
    // Handle the dummy team (byes) for odd number of teams
    if (hasDummy) {
      rounds.forEach(round => {
        round.forEach(game => {
          if (game.home === totalTeams - 1) {
            game.home = "BYE";
          }
          if (game.away === totalTeams - 1) {
            game.away = "BYE";
          }
        });
      });
    }
    
    // Convert home/away balance to a more readable format
    const homeAwayBalance = {};
    for (let i = 0; i < numTeams; i++) {
      homeAwayBalance[i] = {
        home: homeGames[i] || 0,
        away: awayGames[i] || 0
      };
    }
    
    return {
      schedule: rounds,
      homeAwayBalance
    };
  }
  