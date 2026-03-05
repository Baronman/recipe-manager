import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Recipe } from "../types";

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
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

  const cardStyle = {
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: "0 8px",
    background: "#fff",
    whiteSpace: "pre-wrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.1s, box-shadow 0.1s",
  };

  const cardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Recipe Manager</h1>
        <Link
          to="/recipes/new"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d8d8d8",
            background: "#111",
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          + New Recipe
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #d8d8d8" }}
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #d8d8d8" }}
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
          onClick={() => {
            setSearch("");
            setSelectedTag("");
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d8d8d8",
            background: "white",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && filteredRecipes.length === 0 && <p>No recipes match your filters.</p>}

      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 16 }}>
        {filteredRecipes.map((r) => (
          <li key={r.id}>
            <Link
              to={`/recipes/${r.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={cardStyle}
                onMouseEnter={(e) => {
                  Object.assign((e.currentTarget as HTMLDivElement).style, cardHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign((e.currentTarget as HTMLDivElement).style, cardStyle);
                }}
              >
                <strong style={{ fontSize: 18 }}>{r.title}</strong>
                {r.description && (
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111", marginTop: 8 }}>
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
