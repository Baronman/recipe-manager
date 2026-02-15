import type { IngredientRow, Unit } from "../types";
import { ui } from "../ui/ui";

const UNITS: Unit[] = ["oz", "cup", "tbsp", "tsp", "g", "ml", "lb", "pcs"];

function newIngredient(): IngredientRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    quantity: 1,
    unit: "pcs",
  };
}

export function IngredientEditor(props: {
  value: IngredientRow[];
  onChange: (next: IngredientRow[]) => void;
}) {
  const items = props.value;

  function update(id: string, patch: Partial<IngredientRow>) {
    props.onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function remove(id: string) {
    props.onChange(items.filter((i) => i.id !== id));
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((i) => (
        <div key={i.id} style={{ ...ui.row }}>
          <input
            type="number"
            value={i.quantity}
            onChange={(e) => update(i.id, { quantity: Number(e.target.value) })}
            style={{ ...ui.input, width: 110 }}
            min={0}
            step="0.25"
          />

          <select
            value={i.unit}
            onChange={(e) => update(i.id, { unit: e.target.value as Unit })}
            style={{ ...ui.input, width: 120 }}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <input
            value={i.name}
            onChange={(e) => update(i.id, { name: e.target.value })}
            placeholder="Ingredient name (ex: flour)"
            style={{ ...ui.input, flex: 1 }}
          />

          <button
            type="button"
            onClick={() => remove(i.id)}
            style={ui.buttonSecondary}
          >
            Remove
          </button>
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={() => props.onChange([...items, newIngredient()])}
          style={ui.buttonSecondary}
        >
          + Add ingredient
        </button>
      </div>
    </div>
  );
}
