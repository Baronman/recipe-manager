import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IngredientEditor } from "../components/IngredientEditor";
import { supabase } from "../lib/supabase";
import type { IngredientRow } from "../types";
import { ui } from "../ui/ui";

export default function NewRecipePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: crypto.randomUUID(), name: "Flour", quantity: 2, unit: "cup" },
    { id: crypto.randomUUID(), name: "Salt", quantity: 1, unit: "tsp" },
  ]);

  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");

  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);

  const [baseServings, setBaseServings] = useState(2);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) return setError("Title must be 3+ characters.");
    if (!instructions.trim()) return setError("Instructions is required.");

    const cleanedIngredients = ingredients
      .map((i) => ({
        ...i,
        name: i.name.trim(),
        quantity: Number(i.quantity),
      }))
      .filter((i) => i.name.length > 0);

    if (cleanedIngredients.length === 0)
      return setError("Add at least 1 ingredient.");

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);

    const { error } = await supabase.from("recipes").insert({
      title: title.trim(),
      description: description.trim() || null,
      instructions: instructions.trim(),
      tags: tagArray,
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,

      // new fields
      ingredients_json: cleanedIngredients,
      base_servings: baseServings,

      // keep existing column consistent
      servings: baseServings,
      ingredients: cleanedIngredients
        .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
        .join("\n"),
    });

    setSaving(false);

    if (error) return setError(error.message);

    navigate("/");
  }

  return (
    <div style={ui.page}>
      <div style={{ ...ui.row, justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>New Recipe</h1>
        <Link to="/">← Back</Link>
      </div>

      <div style={{ height: 16 }} />

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={ui.card}>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={ui.label}>
              Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={ui.input}
              />
            </label>

            <label style={ui.label}>
              Description
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={ui.input}
              />
            </label>

            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ ...ui.label, flex: 1 }}>
                Prep (min)
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  style={ui.input}
                  min={0}
                />
              </label>

              <label style={{ ...ui.label, flex: 1 }}>
                Cook (min)
                <input
                  type="number"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  style={ui.input}
                  min={0}
                />
              </label>

              <label style={{ ...ui.label, flex: 1 }}>
                Base servings
                <input
                  type="number"
                  value={baseServings}
                  onChange={(e) => setBaseServings(Number(e.target.value))}
                  style={ui.input}
                  min={1}
                />
              </label>
            </div>

            <label style={ui.label}>
              Tags (comma separated)
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={ui.input}
              />
              <span style={ui.help}>Example: dinner, vegetarian</span>
            </label>
          </div>
        </div>

        <div style={ui.card}>
          <h2 style={{ marginTop: 0 }}>Ingredients</h2>
          <IngredientEditor value={ingredients} onChange={setIngredients} />
        </div>

        <div style={ui.card}>
          <h2 style={{ marginTop: 0 }}>Instructions *</h2>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={10}
            style={ui.textarea}
            placeholder="1) ...&#10;2) ..."
          />
        </div>

        <div style={{ ...ui.row, justifyContent: "flex-end" }}>
          <button type="submit" disabled={saving} style={ui.button}>
            {saving ? "Saving..." : "Create Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
