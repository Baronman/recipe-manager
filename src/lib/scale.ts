import type { IngredientRow } from "../types";

export function scaleIngredients(args: {
  ingredients: IngredientRow[];
  baseServings: number;
  targetServings: number;
}) {
  const { ingredients, baseServings, targetServings } = args;

  const base = Math.max(1, baseServings);
  const target = Math.max(1, targetServings);

  const factor = target / base;

  return ingredients.map((i) => ({
    ...i,
    quantity: roundToNice(i.quantity * factor),
  }));
}

function roundToNice(n: number) {
  // 0.25 step is a nice default for cooking
  return Math.round(n * 4) / 4;
}
