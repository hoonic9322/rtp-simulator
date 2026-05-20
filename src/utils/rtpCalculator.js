export function toNumber(value, fallback = 0) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

export function roundNumber(value, digits = 2) {
  const numberValue = toNumber(value);
  return Number(numberValue.toFixed(digits));
}

export function getActivePrizes(prizes) {
  return prizes.filter((prize) => prize.isActive);
}

export function calculateTotalWeight(prizes, weightField) {
  return getActivePrizes(prizes).reduce((total, prize) => {
    return total + Math.max(0, toNumber(prize[weightField]));
  }, 0);
}

export function calculateWeightedPayout(prizes, weightField) {
  return getActivePrizes(prizes).reduce((total, prize) => {
    const amount =
      prize.prizeType === "NO_PRIZE" ? 0 : Math.max(0, toNumber(prize.amount));
    const weight = Math.max(0, toNumber(prize[weightField]));

    return total + amount * weight;
  }, 0);
}

export function calculateAveragePayout(prizes, weightField) {
  const totalWeight = calculateTotalWeight(prizes, weightField);

  if (totalWeight <= 0) {
    return 0;
  }

  return calculateWeightedPayout(prizes, weightField) / totalWeight;
}

export function calculateWinRate(prizes, weightField) {
  const activePrizes = getActivePrizes(prizes);
  const totalWeight = calculateTotalWeight(activePrizes, weightField);

  if (totalWeight <= 0) {
    return 0;
  }

  const winWeight = activePrizes.reduce((total, prize) => {
    if (prize.prizeType === "NO_PRIZE") {
      return total;
    }

    return total + Math.max(0, toNumber(prize[weightField]));
  }, 0);

  return (winWeight / totalWeight) * 100;
}

export function calculateNoPrizeRate(prizes, weightField) {
  const activePrizes = getActivePrizes(prizes);
  const totalWeight = calculateTotalWeight(activePrizes, weightField);

  if (totalWeight <= 0) {
    return 0;
  }

  const noPrizeWeight = activePrizes.reduce((total, prize) => {
    if (prize.prizeType !== "NO_PRIZE") {
      return total;
    }

    return total + Math.max(0, toNumber(prize[weightField]));
  }, 0);

  return (noPrizeWeight / totalWeight) * 100;
}

export function calculateSuggestedSpinCost(averagePayout, targetRtp) {
  const rtpDecimal = Math.max(0, toNumber(targetRtp)) / 100;

  if (rtpDecimal <= 0) {
    return 0;
  }

  return toNumber(averagePayout) / rtpDecimal;
}

export function calculateExpectedSummary(prizes, config, weightField) {
  const spinCount = Math.max(0, toNumber(config.spinCount));
  const calculationMode = config.calculationMode || "SUGGEST_PRICE";

  const targetRtp = Math.max(0, toNumber(config.targetRtp));
  const targetKillRate = Math.max(0, 100 - targetRtp);

  const averagePayout = calculateAveragePayout(prizes, weightField);
  const suggestedSpinCost = calculateSuggestedSpinCost(
    averagePayout,
    targetRtp,
  );

  const manualSpinCost = Math.max(0, toNumber(config.manualSpinCost));
  const finalSpinCost = Math.max(0, toNumber(config.finalSpinCost));

  const effectiveSpinCost =
    calculationMode === "MANUAL_CHECK"
      ? manualSpinCost
      : finalSpinCost > 0
        ? finalSpinCost
        : suggestedSpinCost;

  const actualRtp =
    effectiveSpinCost > 0 ? (averagePayout / effectiveSpinCost) * 100 : 0;

  const actualKillRate = 100 - actualRtp;

  const totalWeight = calculateTotalWeight(prizes, weightField);
  const winRate = calculateWinRate(prizes, weightField);
  const noPrizeRate = calculateNoPrizeRate(prizes, weightField);

  const totalInvestment = spinCount * effectiveSpinCost;
  const totalPayout = spinCount * averagePayout;
  const companyProfit = totalInvestment - totalPayout;
  const companyProfitRate =
    totalInvestment > 0 ? (companyProfit / totalInvestment) * 100 : 0;

  return {
    calculationMode,
    totalWeight: roundNumber(totalWeight, 4),
    averagePayout: roundNumber(averagePayout, 4),
    suggestedSpinCost: roundNumber(suggestedSpinCost, 4),
    manualSpinCost: roundNumber(manualSpinCost, 4),
    finalSpinCost: roundNumber(finalSpinCost, 4),
    effectiveSpinCost: roundNumber(effectiveSpinCost, 4),
    targetRtp: roundNumber(targetRtp, 4),
    targetKillRate: roundNumber(targetKillRate, 4),
    actualRtp: roundNumber(actualRtp, 4),
    actualKillRate: roundNumber(actualKillRate, 4),
    winRate: roundNumber(winRate, 4),
    noPrizeRate: roundNumber(noPrizeRate, 4),
    totalInvestment: roundNumber(totalInvestment, 4),
    totalPayout: roundNumber(totalPayout, 4),
    companyProfit: roundNumber(companyProfit, 4),
    companyProfitRate: roundNumber(companyProfitRate, 4),
    
  };
}

export function calculatePrizeProbability(prize, totalWeight, weightField) {
  if (!prize.isActive || totalWeight <= 0) {
    return 0;
  }

  const weight = Math.max(0, toNumber(prize[weightField]));
  return (weight / totalWeight) * 100;
}

export function calculateExpectedHitCount(
  prize,
  totalWeight,
  weightField,
  spinCount,
) {
  const probability = calculatePrizeProbability(
    prize,
    totalWeight,
    weightField,
  );
  return Math.max(0, toNumber(spinCount)) * (probability / 100);
}

export function calculateExpectedPayout(
  prize,
  totalWeight,
  weightField,
  spinCount,
) {
  if (prize.prizeType === "NO_PRIZE") {
    return 0;
  }

  const expectedHitCount = calculateExpectedHitCount(
    prize,
    totalWeight,
    weightField,
    spinCount,
  );

  return expectedHitCount * Math.max(0, toNumber(prize.amount));
}

export function calculatePrizeRows(prizes, config, weightField) {
  const totalWeight = calculateTotalWeight(prizes, weightField);
  const spinCount = Math.max(0, toNumber(config.spinCount));
  const summary = calculateExpectedSummary(prizes, config, weightField);
  const effectiveSpinCost = summary.effectiveSpinCost;

  return prizes.map((prize) => {
    const probability = calculatePrizeProbability(
      prize,
      totalWeight,
      weightField,
    );
    const expectedHitCount = calculateExpectedHitCount(
      prize,
      totalWeight,
      weightField,
      spinCount,
    );
    const expectedPayout = calculateExpectedPayout(
      prize,
      totalWeight,
      weightField,
      spinCount,
    );

    const amount =
      prize.prizeType === "NO_PRIZE" ? 0 : Math.max(0, toNumber(prize.amount));

    const rtpContribution =
      effectiveSpinCost > 0
        ? ((amount * (probability / 100)) / effectiveSpinCost) * 100
        : 0;

    return {
      ...prize,
      probability: roundNumber(probability, 4),
      expectedHitCount: roundNumber(expectedHitCount, 4),
      expectedPayout: roundNumber(expectedPayout, 4),
      rtpContribution: roundNumber(rtpContribution, 4),
    };
  });
}

export function createDefaultPrizes() {
  return [
    {
      id: crypto.randomUUID(),
      prizeName: "$888",
      prizeType: "CASH",
      amount: 888,
      paidWeight: 1,
      freeWeight: 1,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$100",
      prizeType: "CASH",
      amount: 100,
      paidWeight: 8,
      freeWeight: 5,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$50",
      prizeType: "CASH",
      amount: 50,
      paidWeight: 16,
      freeWeight: 12,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$20",
      prizeType: "CASH",
      amount: 20,
      paidWeight: 35,
      freeWeight: 30,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$10",
      prizeType: "CASH",
      amount: 10,
      paidWeight: 80,
      freeWeight: 80,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$6",
      prizeType: "CASH",
      amount: 6,
      paidWeight: 130,
      freeWeight: 120,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$3",
      prizeType: "CASH",
      amount: 3,
      paidWeight: 280,
      freeWeight: 240,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$1.5",
      prizeType: "CASH",
      amount: 1.5,
      paidWeight: 420,
      freeWeight: 360,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$0.5",
      prizeType: "CASH",
      amount: 0.5,
      paidWeight: 900,
      freeWeight: 800,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "$0.2",
      prizeType: "CASH",
      amount: 0.2,
      paidWeight: 1200,
      freeWeight: 1000,
      isActive: true,
    },
    {
      id: crypto.randomUUID(),
      prizeName: "No Prize",
      prizeType: "NO_PRIZE",
      amount: 0,
      paidWeight: 6000,
      freeWeight: 5000,
      isActive: true,
    },
  ];
}

export function createDefaultConfig() {
  return {
    calculationMode: "SUGGEST_PRICE",
    spinCount: 100000,
    manualSpinCost: 2,
    finalSpinCost: 0,
    currency: "USD",
    targetRtp: 80,
    targetKillRate: 20,
    activeWeightMode: "PAID",
  };
}
