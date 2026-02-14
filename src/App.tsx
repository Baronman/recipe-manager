import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipeListPage from "./pages/RecipeListPage";
import NewRecipePage from "./pages/NewRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import EditRecipePage from "./pages/EditRecipePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeListPage />} />
        <Route path="/recipes/new" element={<NewRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}
