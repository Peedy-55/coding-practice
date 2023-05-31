const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

dbPath = path.join(__dirname, "cricketTeam.db");
db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running...");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
  }
};
initializeDbAndServer();

app.get("/players", async (request, response) => {
  const getPlayersQuery = `SELECT 
  player_id as playerId,
  player_name as playerName,
  jersey_number as jerseyNumber,
  role FROM cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
     VALUES (
         "${playerName}",
         ${jerseyNumber},
         "${role}"
         );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT 
  player_id as playerId,
  player_name as playerName,
  jersey_number as jerseyNumber,
  role FROM cricket_team where player_id=${playerId};`;
  const playerArray = await db.get(getPlayerQuery);
  response.send(playerArray);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team
     SET 
     player_name="${playerName}",
     jersey_number=${jerseyNumber},
     role="${role}";
     WHERE
     player_id=${playerId}`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
