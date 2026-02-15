import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ui } from "../ui/ui";
import { IngredientEditor } from "../components/IngredientEditor";
import type { IngredientRow, Recipe } from "../types";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");

  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [baseServings, setBaseServings] = useState(1);

  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);

  useEffect(() => {
    async function loadRecipe() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const r = data as Recipe;

      setTitle(r.title ?? "");
      setDescription(r.description ?? "");
      setInstructions(r.instructions ?? "");
      setTags(r.tags?.length ? r.tags.join(", ") : "");

      setPrepTime(r.prep_time_minutes ?? 0);
      setCookTime(r.cook_time_minutes ?? 0);

      setBaseServings(r.base_servings ?? r.servings ?? 1);

      // Important: ensure ingredient rows have ids
      const loadedIngredients = (r.ingredients_json ?? []).map((i) => ({
        id: i.id ?? crypto.randomUUID(),
        name: i.name ?? "",
        quantity: Number(i.quantity ?? 1),
        unit: i.unit ?? "pcs",
      }));

      setIngredients(loadedIngredients);

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

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

    const { error } = await supabase
      .from("recipes")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        instructions: instructions.trim(),
        tags: tagArray,
        prep_time_minutes: prepTime,
        cook_time_minutes: cookTime,

        // new fields
        ingredients_json: cleanedIngredients,
        base_servings: baseServings,

        // keep old fields consistent
        servings: baseServings,
        ingredients: cleanedIngredients
          .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
          .join("\n"),
      })
      .eq("id", id);

    setSaving(false);

    if (error) return setError(error.message);

    navigate(`/recipes/${id}`);
  }

  if (loading) {
    return (
      <div style={ui.page}>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={ui.page}>
      <div style={{ ...ui.row, justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Edit Recipe</h1>
        <Link to={`/recipes/${id}`}>← Back</Link>
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
