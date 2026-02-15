export type Unit = "oz" | "cup" | "tbsp" | "tsp" | "g" | "ml" | "lb" | "pcs";

export type IngredientRow = {
  id: string; // for React keys
  name: string;
  quantity: number;
  unit: Unit;
};

export type Recipe = {
  id: string;
  title: string;
  description: string | null;

  // new
  ingredients_json: IngredientRow[];
  base_servings: number;

  // existing
  instructions: string;
  tags: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number; // keep this for now
  created_at: string;
};
