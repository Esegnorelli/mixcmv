
import { Recipe, OperationalCosts, Strategy, MixResult } from '../types';

export const calculateFixedPerBatch = (ops: OperationalCosts) => {
  if (ops.batchDivisor <= 0) return 0;
  return (ops.fixedCosts + ops.labor + ops.packaging) / ops.batchDivisor;
};

export const calculateResults = (
  recipes: Recipe[],
  marketPrices: Record<string, number>,
  operational: OperationalCosts,
  strategy: Strategy,
  manualPrices: Record<string, string>
): MixResult[] => {
  const fixedPerBatch = calculateFixedPerBatch(operational);

  return recipes.map(recipe => {
    const costPerKg = recipe.items.reduce((acc, item) => {
      const price = marketPrices[item.ingredientName] || 0;
      return acc + (price * item.weight);
    }, 0);

    const ingredientsInBatch = costPerKg * strategy.batchSize;
    const totalBatchCost = ingredientsInBatch + fixedPerBatch;
    const suggestedPrice = totalBatchCost * strategy.markup;

    const currentPriceInput = manualPrices[recipe.id];
    const finalPrice = currentPriceInput !== undefined && currentPriceInput !== "" 
      ? parseFloat(currentPriceInput) 
      : suggestedPrice;

    const cmv = finalPrice > 0 ? (totalBatchCost / finalPrice) * 100 : 0;
    const profit = finalPrice - totalBatchCost;
    const margin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;

    return {
      ...recipe,
      costPerKg,
      totalBatchCost,
      suggestedPrice,
      finalPrice,
      displayPrice: currentPriceInput !== undefined ? currentPriceInput : suggestedPrice.toFixed(2),
      cmv,
      profit,
      margin
    };
  });
};
