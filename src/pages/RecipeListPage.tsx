import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  created_at: string;
};

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  async function loadRecipes() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("recipes")
      .select("id, title, description, tags, created_at")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setRecipes(data ?? []);

    setLoading(false);
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  // all unique tags for dropdown
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const r of recipes) {
      for (const t of r.tags ?? []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  // apply search + tag filter locally (fast + simple)
  const filteredRecipes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return recipes.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q);

      const matchesTag = !selectedTag || (r.tags ?? []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [recipes, search, selectedTag]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Recipe Manager</h1>
        <Link to="/recipes/new">+ New Recipe</Link>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ flex: 1, padding: 8 }}
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch("");
            setSelectedTag("");
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && filteredRecipes.length === 0 && (
        <p>No recipes match your filters.</p>
      )}

      <ul style={{ paddingLeft: 16 }}>
        {filteredRecipes.map((r) => (
          <li key={r.id} style={{ marginBottom: 12 }}>
            <strong>
              <Link to={`/recipes/${r.id}`}>{r.title}</Link>
            </strong>

            {r.description ? <div>{r.description}</div> : null}

            <small>Tags: {r.tags?.length ? r.tags.join(", ") : "none"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
