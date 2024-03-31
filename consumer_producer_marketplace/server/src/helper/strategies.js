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
  round,
  roundNum,
  remainingStock,
  consumerAgent,
  capital
) {
  let wallet = consumerAgent.wallet;
  const productCost = currentStock.productCost;
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
  round,
  roundNum,
  remainingStock,
  consumerAgent,
  capital
) {
  if (roundNum == 1) {
    let wallet = consumerAgent.wallet;
    const productCost = currentStock.productCost;
    const mockQuantity = parseInt(wallet / productPrice);
    const soldStock =
      mockQuantity <= remainingStock ? mockQuantity : remainingStock;

    // no stocks were sold
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
    const productCost = currentStock.productCost;
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
    consumerAgent.cheatedHistory[roundNum - 2] == true
  ) {
    let wallet = consumerAgent.wallet;
    const soldStock = 0;
    const productCost = currentStock.productCost;

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
    const productCost = currentStock.productCost;
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
      const productCost = currentStock.productCost;

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
      const productCost = currentStock.productCost;

      if (soldStock == 0) {
        noStockSold(
          initialStock,
          productCost,
          soldStock,
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

    others.push(consumerAgent);
    console.log(others);
    game.set("agents", others);
  }
}

module.exports = { gullibleStrategy, titfortatStrategy, twochoiceStrategy };
