import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { IngredientEditor } from "../components/IngredientEditor";
import { ui } from "../ui/ui";
import type { IngredientRow } from "../types";

export default function NewRecipePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [baseServings, setBaseServings] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanedIngredients = ingredients
      .map((i) => ({ ...i, name: i.name.trim(), quantity: Number(i.quantity) }))
      .filter((i) => i.name.length > 0);

    if (!title.trim() || !instructions.trim() || cleanedIngredients.length === 0) {
      setError("Please fill in all required fields and add at least one ingredient.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("recipes").insert({
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,
      base_servings: baseServings,
      ingredients_json: cleanedIngredients,
      ingredients: cleanedIngredients.map((i) => `${i.quantity} ${i.unit} ${i.name}`).join("\n"),
      created_at: new Date(),
    });

    setSaving(false);
    if (error) return setError(error.message);
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>New Recipe</h1>
        <Link to="/">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        {error && <div style={{ color: "crimson" }}>{error}</div>}

        {/* Basic Info Card */}
        <div style={ui.cardStyle}>
          <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #d8d8d8" }} />

          <label style={{ display: "grid", gap: 6, fontWeight: 600, marginTop: 12 }}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #d8d8d8" }} />

          <div style={{ display: "flex", gap: 2, marginTop: 12, }}>
             <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
                Prep (min)
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  style={{
                    width: 80,        // fixed width
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #d8d8d8",
                    textAlign: "center",
                  }}
                />
              </label>
             <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
              Cook (min)
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                style={{
                  width: 80,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #d8d8d8",
                  textAlign: "center",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
              Base servings
              <input
                type="number"
                value={baseServings}
                onChange={(e) => setBaseServings(Number(e.target.value))}
                style={{
                  width: 80,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #d8d8d8",
                  textAlign: "center",
                }}
              />
            </label>
          </div>

          <label style={{ display: "grid", gap: 6, fontWeight: 600, marginTop: 12 }}>Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #d8d8d8" }} />
        </div>

        {/* Ingredients Card */}
        <div style={ui.cardStyle}>
          <h2>Ingredients</h2>
          <IngredientEditor value={ingredients} onChange={setIngredients} />
        </div>

        {/* Instructions Card */}
        <div style={ui.cardStyle}>
          <h2>Instructions *</h2>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={10} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #d8d8d8", boxSizing: "border-box" }} />
        </div>

        <button type="submit" disabled={saving} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d8d8d8", background: "#111", color: "white", cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Recipe"}
        </button>
      </form>
    </div>
  );
}