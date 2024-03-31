import { noStockSold, stockSold } from "./stocks";

function gullibleStrategy(
  tempStock,
  currentStock,
  player,
  others,
  initialStock,
  productAdQuality,
  productPrice,
  productQuality,
  productAdQuality,
  round,
  roundNum,
  remainingStock,
  consumerAgent,
  capital
) {
  let wallet = consumerAgent.wallet;
  const mockQuantity = parseInt(wallet / productPrice);
  const soldStock =
    mockQuantity <= remainingStock ? mockQuantity : remainingStock;
  if (soldStock == 0) {
    noStockSold(
      initialStock,
      productCost,
      soldStock,
      productPrice,
      player,
      consumerAgent,
      productQuality,
      productAdQuality,
      round,
      roundNum,
      others,
      remainingStock,
      capital
    );
  } else {
    stockSold(
      tempStock,
      soldStock,
      currentStock,
      player,
      others,
      initialStock,
      productAdQuality,
      productPrice,
      productQuality,
      productAdQuality,
      round,
      roundNum,
      remainingStock,
      consumerAgent,
      wallet,
      capital
    );
  }

  others.push(consumerAgent);
  console.log(others);
  game.set("agents", others);
}

function titfortatStrategy(
  tempStock,
  currentStock,
  player,
  others,
  initialStock,
  productAdQuality,
  productPrice,
  productQuality,
  productAdQuality,
  round,
  roundNum,
  remainingStock,
  consumerAgent,
  capital
) {
  if (roundNum == 1) {
    let wallet = consumerAgent.wallet;
    const mockQuantity = parseInt(wallet / productPrice);
    const soldStock =
      mockQuantity <= remainingStock ? mockQuantity : remainingStock;

    // no stocks were sold
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
      stockSold(
        tempStock,
        soldStock,
        currentStock,
        player,
        others,
        initialStock,
        productAdQuality,
        productPrice,
        productQuality,
        productAdQuality,
        round,
        roundNum,
        remainingStock,
        consumerAgent,
        wallet,
        capital
      );
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
}

function twochoiceStrategy(
  tempStock,
  currentStock,
  player,
  others,
  initialStock,
  productAdQuality,
  productPrice,
  productQuality,
  productAdQuality,
  round,
  roundNum,
  remainingStock,
  consumerAgent,
  capital
) {
  // acts gullible the first two rounds
  if (roundNum == 1 || roundNum == 2) {
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
      stockSold(
        tempStock,
        soldStock,
        currentStock,
        player,
        others,
        initialStock,
        productCost,
        productPrice,
        productQuality,
        productAdQuality,
        round,
        roundNum,
        remainingStock,
        consumerAgent,
        wallet,
        capital
      );
    }
    // starts considering history
  } else {
    // if cheated last round or the round before
    if (
      consumerAgent.cheatedHistory[roundNum - 1] ||
      consumerAgent.cheatedHistory[roundNum - 2]
    ) {
      // buy no stocks
      let wallet = consumerAgent.wallet;
      const mockQuantity = parseInt(wallet / productPrice);
      const soldStock = 0;

      noStockSold(
        initialStock,
        player,
        soldStock,
        productPrice,
        player,
        consumerAgent,
        productQuality,
        productAdQuality,
        round,
        roundNum,
        others,
        remainingStock,
        capital
      );
    } else {
      // buy all available stocks
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
        stockSold(
          tempStock,
          soldStock,
          currentStock,
          player,
          others,
          initialStock,
          productCost,
          productPrice,
          productQuality,
          productAdQuality,
          round,
          roundNum,
          remainingStock,
          consumerAgent,
          wallet,
          capital
        );
      }
    }
  }
}

module.exports = { gullibleStrategy, titfortatStrategy, twochoiceStrategy };
