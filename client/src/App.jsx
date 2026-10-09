import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Auth/LoginPage.jsx";
import SignUpPage from "./Auth/SignUpPage.jsx";
import ProtectedPage from "./Components/ProtectedPage.jsx";
import SiteLayout from "./Components/SiteLayout.jsx";
import TemplateFavorites from "./Components/TemplateFavorites.jsx";
import TemplateCatalog from "./Components/TemplateCatalog.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Navigate to="/templates" replace />} />
          <Route path="/templates" element={<TemplateCatalog />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedPage>
                <TemplateFavorites />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<Navigate to="/templates" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
