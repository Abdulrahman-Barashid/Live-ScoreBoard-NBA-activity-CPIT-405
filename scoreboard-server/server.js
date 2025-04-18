const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Array of 3 games
let games = [
  {
    homeTeam: {
      city: "Golden State",
      name: "Warriors",
      abbreviation: "GSW",
      wins: 48,
      losses: 34,
      score: 50,
      stats: {
        fgPercentage: "45.3%",
        threePointMade: 10,
        threePointAttempts: 27,
        rebounds: 30
      }
    },
    awayTeam: {
      city: "Houston",
      name: "Rockets",
      abbreviation: "HOU",
      wins: 40,
      losses: 42,
      score: 47,
      stats: {
        fgPercentage: "43.1%",
        threePointMade: 8,
        threePointAttempts: 25,
        rebounds: 28
      }
    },
    period: 4,
    timeRemaining: "8:43",
    gameStatus: "live"
  },
  {
    homeTeam: {
      city: "Denver",
      name: "Nuggets",
      abbreviation: "DEN",
      wins: 53,
      losses: 29,
      score: 60,
      stats: {
        fgPercentage: "48.0%",
        threePointMade: 9,
        threePointAttempts: 22,
        rebounds: 36
      }
    },
    awayTeam: {
      city: "LA",
      name: "Clippers",
      abbreviation: "LAC",
      wins: 47,
      losses: 35,
      score: 58,
      stats: {
        fgPercentage: "44.7%",
        threePointMade: 7,
        threePointAttempts: 23,
        rebounds: 34
      }
    },
    period: 4,
    timeRemaining: "3:27",
    gameStatus: "live"
  },
  {
    homeTeam: {
      city: "Los Angeles",
      name: "Lakers",
      abbreviation: "LAL",
      wins: 51,
      losses: 31,
      score: 69,
      stats: {
        fgPercentage: "46.2%",
        threePointMade: 11,
        threePointAttempts: 30,
        rebounds: 38
      }
    },
    awayTeam: {
      city: "Minnesota",
      name: "Timberwolves",
      abbreviation: "MIN",
      wins: 49,
      losses: 33,
      score: 71,
      stats: {
        fgPercentage: "47.9%",
        threePointMade: 12,
        threePointAttempts: 28,
        rebounds: 33
      }
    },
    period: 4,
    timeRemaining: "5:42",
    gameStatus: "live"
  }
];

// Function to simulate game progress for all games
function simulateGameProgress() {
  games.forEach((game) => {
    if (game.gameStatus !== 'live') return;

    const scoringTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    const pointsScored = Math.floor(Math.random() * 4);

    if (pointsScored > 0) {
      game[scoringTeam].score += pointsScored;

      if (pointsScored === 3) {
        game[scoringTeam].stats.threePointMade += 1;
        game[scoringTeam].stats.threePointAttempts += 1;
      } else if (pointsScored === 2 || pointsScored === 1) {
        const newPercentage = Math.min(Math.max(
          parseFloat(game[scoringTeam].stats.fgPercentage) + (Math.random() * 0.5 - 0.25),
          35.0), 65.0).toFixed(1);
        game[scoringTeam].stats.fgPercentage = newPercentage + "%";
      }
    } else {
      if (Math.random() > 0.7) {
        game[scoringTeam].stats.threePointAttempts += 1;
      }
    }

    const reboundTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    if (Math.random() > 0.7) {
      game[reboundTeam].stats.rebounds += 1;
    }

    const currentMinutes = parseInt(game.timeRemaining.split(':')[0]);
    const currentSeconds = parseInt(game.timeRemaining.split(':')[1]);
    let newSeconds = currentSeconds - Math.floor(Math.random() * 24);
    let newMinutes = currentMinutes;

    if (newSeconds < 0) {
      newMinutes -= 1;
      newSeconds += 60;
    }

    if (newMinutes < 0) {
      game.period += 1;
      if (game.period > 4) {
        if (game.homeTeam.score === game.awayTeam.score) {
          game.timeRemaining = "5:00";
        } else {
          game.gameStatus = "final";
          game.timeRemaining = "0:00";
        }
      } else {
        game.timeRemaining = "12:00";
      }
    } else {
      game.timeRemaining = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
    }
  });
}

setInterval(simulateGameProgress, 3000);

// Return all game data
app.get('/api/game', (req, res) => {
  res.json(games);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
