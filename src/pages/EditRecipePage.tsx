import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  tags: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
};

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");

  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(1);

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

      setTitle(r.title);
      setDescription(r.description ?? "");
      setIngredients(r.ingredients);
      setInstructions(r.instructions);
      setTags(r.tags?.length ? r.tags.join(", ") : "");
      setPrepTime(r.prep_time_minutes);
      setCookTime(r.cook_time_minutes);
      setServings(r.servings);

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setError(null);

    if (title.trim().length < 3) return setError("Title must be 3+ characters.");
    if (!ingredients.trim()) return setError("Ingredients is required.");
    if (!instructions.trim()) return setError("Instructions is required.");

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
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        tags: tagArray,
        prep_time_minutes: prepTime,
        cook_time_minutes: cookTime,
        servings,
      })
      .eq("id", id);

    setSaving(false);

    if (error) return setError(error.message);

    navigate(`/recipes/${id}`);
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Edit Recipe</h1>
        <Link to={`/recipes/${id}`}>← Back</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <label>
          Title *
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Ingredients * (one per line)
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Instructions *
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Tags (comma separated)
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <label style={{ flex: 1 }}>
            Prep (min)
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label style={{ flex: 1 }}>
            Cook (min)
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(Number(e.target.value))}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label style={{ flex: 1 }}>
            Servings
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <button type="submit" disabled={saving} style={{ padding: 10 }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
