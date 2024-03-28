// Function to assign roles to players
function assignRoles(game) {
  const treatment = game.get("treatment");
  const producerPercentage = treatment.producerPercentage;
  const players = game.players;
  const numberOfProducers = Math.round(producerPercentage * players.length);

  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  shuffledPlayers.forEach((player, index) => {
    // const role = index < numberOfProducers ? "producer" : "consumer";
    const role = "producer";
    player.set("role", role);
  });
}

module.exports = { assignRoles };
