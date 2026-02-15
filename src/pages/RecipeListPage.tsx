import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ui } from "../ui/ui";
import type { Recipe } from "../types";

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  async function loadRecipes() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setRecipes(data ?? []);

    setLoading(false);
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const r of recipes) {
      for (const t of r.tags ?? []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

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
    <div style={ui.page}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Recipe Manager</h1>
        <Link to="/recipes/new" style={ui.button}>
          + New Recipe
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={ui.input}
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={ui.input}
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          type="button"
          style={ui.buttonSecondary}
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

      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 16 }}>
        {filteredRecipes.map((r) => (
          <li key={r.id}>
            <Link
              to={`/recipes/${r.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={ui.card}
                onMouseEnter={(e) => {
                  Object.assign((e.currentTarget as HTMLDivElement).style, ui.cardHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign((e.currentTarget as HTMLDivElement).style, ui.card);
                }}
              >
                <strong style={{ fontSize: 18 }}>{r.title}</strong>
                {r.description && (
  <div style={{ marginTop: 8, fontSize: 18, fontWeight: 600, color: "#111" }}>
    {r.description}
  </div>
)}
                <small style={{ display: "block", marginTop: 8, color: "#555" }}>
                  Tags: {r.tags?.length ? r.tags.join(", ") : "none"}
                </small>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
