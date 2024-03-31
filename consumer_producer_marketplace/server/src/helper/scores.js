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

function noStockSold(
  initialStock,
  productCost,
  soldStock,
  productCost,
  player,
  consumerAgent,
  others
) {
  const totalCost = initialStock * productCost;
  const totalSales = soldStock * productPrice;
  const originalScore = player.get("score") || 0;

  let score = player.get("score") || 0;
  score += totalSales - totalCost;
  consumerAgent.purchaseHistory.push({
    productQuality: productQuality,
    productAdQuality: productAdQuality,
    quantity: 0,
    round: round,
    roundNum: roundNum,
  });

  let consumerScore = consumerAgent.score;
  consumerAgent.scores.push({
    score: consumerScore,
    round: round,
    roundNum: roundNum,
  });

  others.forEach((producerAgent) => {
    producerAgent.scores.push({
      score: score,
      round: round,
      roundNum: roundNum,
    });

    producerAgent.productionHistory.push({
      productQuality: productQuality,
      productAdQuality: productAdQuality,
      initialStock: initialStock,
      remainingStock: remainingStock,
      soldStock: soldStock,
      round: round,
      roundNum: roundNum,
    });
  });

  let cheated =
    productAdQuality === productQuality
      ? false
      : productAdQuality === "low" && productQuality === "high"
      ? false
      : true;
  consumerAgent.cheatedHistory.push(cheated);

  player.set("score", score);
  player.set("scoreDiff", score - originalScore);
  player.set("capital", capital + totalSales);
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
      let wallet = consumerAgent.wallet;
      const mockQuantity = parseInt(wallet / productPrice);
      const soldStock =
        mockQuantity <= remainingStock ? mockQuantity : remainingStock;

      if (soldStock == 0) {
        noStockSold(
          initialStock,
          productCost,
          soldStock,
          productCost,
          player,
          consumerAgent,
          others
        );
      } else {
        // if stock IS sold
        const trialStock = tempStock.map((item) => {
          return item.round === round
            ? {
                ...item,
                remainingStock: item.remainingStock - soldStock,
                soldStock: item.soldStock + soldStock,
              }
            : item;
        });

        player.set("stock", trialStock);
        const totalCost = initialStock * productCost;
        const totalSales = soldStock * productPrice;
        const originalScore = player.get("score") || 0;
        let score = player.get("score") || 0;
        score += totalSales - totalCost;

        consumerAgent.purchaseHistory.push({
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          quantity: soldStock,
          round: round,
          roundNum: roundNum,
        });
        let consumerScore = consumerAgent.score;
        consumerScore = (value - productPrice) * soldStock;
        consumerAgent.score = consumerScore;
        consumerAgent.scores.push({
          score: consumerScore,
          round: round,
          roundNum: roundNum,
        });
        let cheated =
          productAdQuality === productQuality
            ? false
            : productAdQuality === "low" && productQuality === "high"
            ? false
            : true;
        consumerAgent.cheatedHistory.push(cheated);
        others.forEach((producerAgent) => {
          producerAgent.scores.push({
            score: score,
            round: round,
            roundNum: roundNum,
          });
          producerAgent.productionHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            initialStock: initialStock,
            remainingStock: remainingStock,
            soldStock: soldStock,
            round: round,
            roundNum: roundNum,
          });
        });
        wallet = wallet - parseInt(productPrice * soldStock);
        consumerAgent.wallet = wallet;
        player.set("score", score);
        player.set("scoreDiff", score - originalScore);
        player.set("capital", capital + totalSales);
      }
      others.push(consumerAgent);
      console.log(others);
      game.set("agents", others);
    } else if (consumerAgent.strategy == "titfortat") {
      if (roundNum == 1) {
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock =
          mockQuantity <= remainingStock ? mockQuantity : remainingStock;

        if (soldStock == 0) {
          noStockSold(
            initialStock,
            productCost,
            soldStock,
            productCost,
            player,
            consumerAgent,
            others
          );
        } else {
          const trialStock = tempStock.map((item) => {
            return item.round === round
              ? {
                  ...item,
                  remainingStock: item.remainingStock - soldStock,
                  soldStock: item.soldStock + soldStock,
                }
              : item;
          });

          player.set("stock", trialStock);
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += totalSales - totalCost;

          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: soldStock,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerScore = (value - productPrice) * soldStock;
          consumerAgent.score = consumerScore;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum,
          });
          others.forEach((producerAgent) => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum,
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum,
            });
          });
          let cheated =
            productAdQuality === productQuality
              ? false
              : productAdQuality === "low" && productQuality === "high"
              ? false
              : true;
          consumerAgent.cheatedHistory.push(cheated);
          wallet = wallet - parseInt(productPrice * soldStock);
          consumerAgent.wallet = wallet;
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
      } else if (
        roundNum > 1 &&
        consumerAgent.cheatedHistory[roundNum - 2] == false
      ) {
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock =
          mockQuantity <= remainingStock ? mockQuantity : remainingStock;
        if (soldStock == 0) {
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;

          let score = player.get("score") || 0;
          score += totalSales - totalCost;
          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: 0,
            round: round,
            roundNum: roundNum,
          });

          let consumerScore = consumerAgent.score;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum,
          });
          others.forEach((producerAgent) => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum,
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum,
            });
          });
          let cheated =
            productAdQuality === productQuality
              ? false
              : productAdQuality === "low" && productQuality === "high"
              ? false
              : true;
          consumerAgent.cheatedHistory.push(cheated);
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        } else {
          const trialStock = tempStock.map((item) => {
            return item.round === round
              ? {
                  ...item,
                  remainingStock: item.remainingStock - soldStock,
                  soldStock: item.soldStock + soldStock,
                }
              : item;
          });

          player.set("stock", trialStock);
          const totalCost = initialStock * productCost;
          const totalSales = soldStock * productPrice;
          const originalScore = player.get("score") || 0;
          let score = player.get("score") || 0;
          score += totalSales - totalCost;

          consumerAgent.purchaseHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            quantity: soldStock,
            round: round,
            roundNum: roundNum,
          });
          let consumerScore = consumerAgent.score;
          consumerScore = (value - productPrice) * soldStock;
          consumerAgent.score = consumerScore;
          consumerAgent.scores.push({
            score: consumerScore,
            round: round,
            roundNum: roundNum,
          });
          others.forEach((producerAgent) => {
            producerAgent.scores.push({
              score: score,
              round: round,
              roundNum: roundNum,
            });
            producerAgent.productionHistory.push({
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              initialStock: initialStock,
              remainingStock: remainingStock,
              soldStock: soldStock,
              round: round,
              roundNum: roundNum,
            });
          });
          let cheated =
            productAdQuality === productQuality
              ? false
              : productAdQuality === "low" && productQuality === "high"
              ? false
              : true;
          consumerAgent.cheatedHistory.push(cheated);
          wallet = wallet - parseInt(productPrice * soldStock);
          consumerAgent.wallet = wallet;
          player.set("score", score);
          player.set("scoreDiff", score - originalScore);
          player.set("capital", capital + totalSales);
        }
      } else if (
        roundNum > 1 &&
        consumerAgent.cheatedHistory[roundNum - 2] == true
      ) {
        let wallet = consumerAgent.wallet;
        const soldStock = 0;
        const totalCost = initialStock * productCost;
        const totalSales = soldStock * productPrice;
        const originalScore = player.get("score") || 0;
        let score = player.get("score") || 0;
        score += totalSales - totalCost;
        consumerAgent.purchaseHistory.push({
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          quantity: 0,
          round: round,
          roundNum: roundNum,
        });
        let consumerScore = consumerAgent.score;
        consumerAgent.scores.push({
          score: consumerScore,
          round: round,
          roundNum: roundNum,
        });
        others.forEach((producerAgent) => {
          producerAgent.scores.push({
            score: score,
            round: round,
            roundNum: roundNum,
          });
          producerAgent.productionHistory.push({
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            initialStock: initialStock,
            remainingStock: remainingStock,
            soldStock: soldStock,
            round: round,
            roundNum: roundNum,
          });
        });
        let cheated =
          productAdQuality === productQuality
            ? false
            : productAdQuality === "low" && productQuality === "high"
            ? false
            : true;
        consumerAgent.cheatedHistory.push(cheated);
        player.set("score", score);
        player.set("scoreDiff", score - originalScore);
        player.set("capital", capital + totalSales);
      }
      others.push(consumerAgent);
      console.log(others);
      game.set("agents", others);
    } else if (consumerAgent.strategy == "twochoice") {
      // starts off trusting ...
      if (roundNum == 1) {
        let wallet = consumerAgent.wallet;
        const mockQuantity = parseInt(wallet / productPrice);
        const soldStock =
          mockQuantity <= remainingStock ? mockQuantity : remainingStock;
      }
      if (soldStock == 0) {
        noStockSold(
          initialStock,
          productCost,
          soldStock,
          productCost,
          player,
          consumerAgent,
          others
        );
      }
    }
  });
}

module.exports = { updateConsumerScores, updateProducerScores };
