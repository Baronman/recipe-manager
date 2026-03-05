import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { scaleIngredients } from "../lib/scale";
import type { Recipe, IngredientRow } from "../types";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [targetServings, setTargetServings] = useState<number>(1);

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

      if (error) setError(error.message);
      else {
        const r = data as Recipe;
        setRecipe(r);
        setTargetServings(r.base_servings ?? 1);
      }

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this recipe?")) return;

    setDeleting(true);
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    setDeleting(false);

    if (error) return setError(error.message);
    navigate("/");
  }

  if (loading) return <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "crimson" }}>Error: {error} <br /><Link to="/">← Back</Link></div>;
  if (!recipe) return <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>Recipe not found. <Link to="/">← Back</Link></div>;

  const scaledIngredients: IngredientRow[] = scaleIngredients({
    ingredients: recipe.ingredients_json ?? [],
    baseServings: recipe.base_servings ?? 1,
    targetServings,
  });

  const cardStyle = {
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    color: "#111",
    marginTop: 16,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/">← Back</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to={`/recipes/${recipe.id}/edit`}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d8d8d8", background: "white", color: "#111", cursor: "pointer" }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d8d8d8", background: "white", color: "#111", cursor: "pointer" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <h1>{recipe.title}</h1>
      {recipe.description && (
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "#111" }}>
          {recipe.description}
        </div>
      )}

      <p>
        <strong>Prep:</strong> {recipe.prep_time_minutes} min{" "}
        <strong>Cook:</strong> {recipe.cook_time_minutes} min{" "}
        <strong>Base servings:</strong> {recipe.base_servings}
      </p>

      <p>
        <strong>Tags:</strong> {recipe.tags?.length ? recipe.tags.join(", ") : "none"}
      </p>

      {/* Ingredients Card */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ marginTop: 0, color: "#111" }}>Ingredients</h2>
          {/* Display-only servings */}
          <div style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600, width: 120 }}>
            Servings
            <div
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #d8d8d8",
                background: "#f5f5f5",
                color: "#111",
                textAlign: "center",
              }}
            >
              {targetServings}
            </div>
          </div>
        </div>

        <ul style={{ marginTop: 12 }}>
          {scaledIngredients.map((i) => (
            <li key={i.id}>
              <strong>{i.quantity}</strong> {i.unit} {i.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions Card */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#111" }}>Instructions</h2>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0, color: "#111" }}>{recipe.instructions}</pre>
      </div>
    </div>
  );
}