import { ClassicListenersCollector } from "@empirica/core/admin/classic";
// import { getconsumerAgentFromId } from "../../client/src/strategie/ConsumerAgent.js"

export const Empirica = new ClassicListenersCollector();

const fs = require("fs");
const path = require("path");

const folderPath = "/";
const fileName = "choices_consumer.json";
const filePath = path.join(folderPath, fileName);

import { updateConsumerScores, updateProducerScores } from "./helper/scores";
import { assignRoles } from "./helper/roles";

Empirica.onGameStart(async ({ game }) => {
  // TODO: Remove hardcoded values
  const numRounds = 5;
  for (let roundNumber = 1; roundNumber <= numRounds; roundNumber++) {
    const round = game.addRound({ name: `Round${roundNumber}` });
    round.addStage({ name: "selectRoleStage", duration: 24000 });
    round.addStage({ name: "stockStage", duration: 24000 });
    // round.addStage({ name: "choiceStage", duration: 24000 });
    round.addStage({ name: "feedbackStage", duration: 24000 });
    round.addStage({ name: "scoreboardStage", duration: 24000 });
  }

  game.players.forEach((player) => {
    player.set("score", 0);
  });
  assignRoles(game);
});

// Empirica.onStageStart(({ stage }) => {
//   switch(stage.get("name")) {

//   }
// })

Empirica.onStageEnded(({ stage }) => {
  switch (stage.get("name")) {
    // case "choiceStage":
    //   updateProducerScores(stage.currentGame);
    //   updateConsumerScores(stage.currentGame);
    //   break;
    case "stockStage":
      updateProducerScores(stage.currentGame);
      break;
  }
});

Empirica.onGameEnded(({ game }) => {});
