import { ArrowDown, ArrowUpRight, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore.js";
import { api, getErrorMessage } from "../config/api.js";
import TemplateCard from "./TemplateCard.jsx";

export default function TemplateCatalog() {
  const [templates, setTemplates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTemplates() {
      try {
        const { data } = await api.get("/templates");
        setTemplates(data.templates);
        if (token) {
          try {
            const favoriteResponse = await api.get("/favorites");
            setFavorites(
              favoriteResponse.data.templates.map((item) => item.id),
            );
          } catch (favoriteError) {
            if (favoriteError.response?.status === 401) signOut();
          }
        } else setFavorites([]);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    }
    loadTemplates();
  }, [token, signOut]);

  const categories = useMemo(
    () => [
      "All categories",
      ...new Set(templates.map((item) => item.category)),
    ],
    [templates],
  );
  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) => {
        const matchesQuery =
          `${template.name} ${template.description} ${template.category}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (category === "All categories" || template.category === category)
        );
      }),
    [templates, query, category],
  );

  async function toggleFavorite(template) {
    if (!token) return navigate("/login", { state: { from: "/templates" } });
    const alreadyFavorite = favorites.includes(template.id);
    setError("");
    try {
      if (alreadyFavorite) {
        await api.delete(`/favorites/${template.id}`);
        setFavorites((current) => current.filter((id) => id !== template.id));
      } else {
        await api.post(`/favorites/${template.id}`);
        setFavorites((current) => [...current, template.id]);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow">
            <Sparkles size={14} /> A good place to begin
          </div>
          <h1>
            Make room for
            <br />
            <span>your next big idea.</span>
          </h1>
          <p className="hero-description">
            Thoughtful website templates made to help your best work find its
            shape.
          </p>
          <a className="hero-link" href="#template-gallery">
            Find your starting point <ArrowDown size={15} />
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-window">
            <div className="art-bar">
              <i />
              <i />
              <i />
              <span>your next project</span>
            </div>
            <div className="art-page">
              <div className="art-kicker">A NEW PERSPECTIVE</div>
              <div className="art-title">
                Good things
                <br />
                take shape.
              </div>
              <div className="art-line" />
              <div className="art-blocks">
                <i />
                <i />
              </div>
            </div>
          </div>
          <span className="art-star">✳</span>
          <span className="art-caption">Ideas, meet interface.</span>
        </div>
        <span className="hero-note">INDEPENDENTLY MADE · ALWAYS INSPIRING</span>
      </section>

      <section id="template-gallery" className="gallery-section">
        <div className="gallery-heading">
          <div>
            <div className="eyebrow muted-eyebrow">THE COLLECTION</div>
            <h2>
              A template for every <em>beginning.</em>
            </h2>
          </div>
          <p className="gallery-intro">
            Good design gives your idea a head start. Find the look that feels
            like you.
          </p>
        </div>
        <div className="filter-row">
          <label className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a template..."
              aria-label="Search templates"
            />
          </label>
          <label className="category-select">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ArrowDown size={14} />
          </label>
          <span className="result-count">
            {filteredTemplates.length} TEMPLATES
          </span>
        </div>
        {error && <div className="notice notice-error">{error}</div>}
        {filteredTemplates.length ? (
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favorites.includes(template.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No templates found</h3>
            <p>Try another search or category.</p>
            <button
              className="text-button"
              onClick={() => {
                setQuery("");
                setCategory("All categories");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <section className="cta-section">
        <div className="cta-symbol">✳</div>
        <div>
          <span className="eyebrow">YOUR PERSONAL SHORTLIST</span>
          <h2>
            Keep the ones
            <br />
            that <em>speak to you.</em>
          </h2>
        </div>
        <div className="cta-action">
          <p>
            Save your favorite starting points
            <br />
            and come back whenever you're ready.
          </p>
          <Link
            className="button button-dark"
            to={token ? "/favorites" : "/register"}
          >
            {token ? "View my favorites" : "Create a free account"}{" "}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
