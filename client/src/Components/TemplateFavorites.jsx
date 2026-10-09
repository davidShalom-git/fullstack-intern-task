import { ArrowUpRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore.js";
import { api, getErrorMessage } from "../config/api.js";
import TemplateCard from "./TemplateCard.jsx";

export default function TemplateFavorites() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    api
      .get("/favorites")
      .then(({ data }) => setTemplates(data.templates))
      .catch((requestError) => {
        if (requestError.response?.status === 401) {
          signOut();
          return;
        }
        setError(getErrorMessage(requestError));
      })
      .finally(() => setLoading(false));
  }, [signOut]);

  async function removeFavorite(template) {
    try {
      await api.delete(`/favorites/${template.id}`);
      setTemplates((current) =>
        current.filter((item) => item.id !== template.id),
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <section className="favorites-page">
      <div className="favorites-heading">
        <div>
          <div className="eyebrow muted-eyebrow">
            <Heart size={13} /> YOUR PERSONAL SHORTLIST
          </div>
          <h1>
            Things you <em>love.</em>
          </h1>
          <p>All your saved starting points, together in one place.</p>
        </div>
        <Link className="button button-outline" to="/templates">
          Explore templates <ArrowUpRight size={16} />
        </Link>
      </div>
      {error && <div className="notice notice-error">{error}</div>}
      {loading ? (
        <div className="empty-state">
          <p>Loading your favorites...</p>
        </div>
      ) : templates.length ? (
        <div className="template-grid">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite
              onToggleFavorite={removeFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <div className="empty-heart">
            <Heart size={25} />
          </div>
          <h2>Your shortlist is a blank canvas.</h2>
          <p>Tap the heart on a template to save it here for later.</p>
          <Link className="button button-dark" to="/templates">
            Find something you love <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
