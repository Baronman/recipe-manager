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
  created_at: string;
};

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      else setRecipe(data);

      setLoading(false);
    }

    loadRecipe();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    const ok = confirm("Delete this recipe?");
    if (!ok) return;

    setDeleting(true);

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    setDeleting(false);

    if (error) return setError(error.message);

    navigate("/");
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <p style={{ color: "crimson" }}>Error: {error}</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <p>Recipe not found.</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">← Back</Link>

        <div style={{ display: "flex", gap: 12 }}>
          <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>

          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <h1>{recipe.title}</h1>

      {recipe.description ? <p>{recipe.description}</p> : null}

      <p>
        <strong>Prep:</strong> {recipe.prep_time_minutes} min{" "}
        <strong>Cook:</strong> {recipe.cook_time_minutes} min{" "}
        <strong>Servings:</strong> {recipe.servings}
      </p>

      <p>
        <strong>Tags:</strong>{" "}
        {recipe.tags.length ? recipe.tags.join(", ") : "none"}
      </p>

      <hr />

      <h2>Ingredients</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.ingredients}</pre>

      <h2>Instructions</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</pre>
    </div>
  );
}
