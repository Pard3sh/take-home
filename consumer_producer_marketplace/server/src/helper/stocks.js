function noStockSold(
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

// as many as possible stocks can be bought from the producer, that many will be bought
function stockSold(
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
) {
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
  const value = currentStock.value;
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

module.exports = { noStockSold, stockSold };
