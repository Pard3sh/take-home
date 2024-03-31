import {
  gullibleStrategy,
  titfortatStrategy,
  twochoiceStrategy,
} from "./strategies.js";

async function updateConsumerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;

    const basket = player.get("basket");
    const round = player.round.get("round");
    const originalScore = player.get("score") || 0;

    let score = player.get("score") || 0;

    basket.forEach((item) => {
      if (item.round === round) {
        score += (item.value - item.productPrice) * item.quantity;
      }
    });

    player.set("score", score);
    player.set("scoreDiff", score - originalScore);
  });
}

// Function to update the score of producers
async function updateProducerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;

    const round = player.round.get("round");
    const capital = player.get("capital");
    const tempStock = player.get("stock");
    const currentStock = tempStock.find((item) => item.round === round);
    const remainingStock = currentStock.remainingStock;
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    const productQuality = currentStock.productQuality;
    const productAdQuality = currentStock.productAdQuality;
    const initialStock = currentStock.initialStock;
    const value = currentStock.value;
    const agents = game.get("agents");

    const consumerAgent = agents.find((p) => {
      return p.role === "consumer" && p.agent === "artificial";
    });

    // player producers (not consumer and not artificial)
    const others = agents.filter((p) => {
      return p.role !== "consumer" || p.agent !== "artificial";
    });

    // const strategy = getconsumerAgentFromId(consumerAgent.strategy);
    const roundNum = parseInt(round.replace("Round", ""), 10);
    if (consumerAgent.strategy == "gullible") {
      gullibleStrategy(
        tempStock,
        currentStock,
        player,
        others,
        initialStock,
        productAdQuality,
        productPrice,
        productQuality,
        round,
        roundNum,
        remainingStock,
        consumerAgent,
        capital
      );
    } else if (consumerAgent.strategy == "titfortat") {
      titfortatStrategy(
        tempStock,
        currentStock,
        player,
        others,
        initialStock,
        productAdQuality,
        productPrice,
        productQuality,
        round,
        roundNum,
        remainingStock,
        consumerAgent,
        capital
      );
    } else if (consumerAgent.strategy == "twochoice") {
      twochoiceStrategy(
        tempStock,
        currentStock,
        player,
        others,
        initialStock,
        productAdQuality,
        productPrice,
        productQuality,
        round,
        roundNum,
        remainingStock,
        consumerAgent,
        capital
      );
    }
  });
}

module.exports = { updateConsumerScores, updateProducerScores };
