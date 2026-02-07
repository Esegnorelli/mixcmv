
export interface RecipeItem {
  ingredientName: string;
  weight: number; 
}

export interface Recipe {
  id: string;
  name: string;
  items: RecipeItem[];
}

export interface OperationalCosts {
  fixedCosts: number;
  labor: number;
  packaging: number;
  batchDivisor: number;
}

export interface Strategy {
  markup: number;
  batchSize: number;
}

export interface MixResult extends Recipe {
  costPerKg: number;
  totalBatchCost: number;
  suggestedPrice: number;
  finalPrice: number;
  displayPrice: string;
  cmv: number;
  profit: number;
  margin: number;
}
