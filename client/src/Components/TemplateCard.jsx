import { ArrowUpRight, Heart } from "lucide-react";

export default function TemplateCard({
  template,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className="template-card">
      <div className="card-image-wrap">
        <img
          className="card-image"
          src={template.thumbnail_url}
          alt={`${template.name} template preview`}
          loading="lazy"
        />
        <span className="category-pill">{template.category}</span>
        <button
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onToggleFavorite(template)}
          aria-label={
            isFavorite
              ? `Remove ${template.name} from favorites`
              : `Add ${template.name} to favorites`
          }
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-copy">
        <div className="card-heading">
          <h2>{template.name}</h2>
          <ArrowUpRight size={17} className="card-arrow" />
        </div>
        <p>{template.description}</p>
      </div>
    </article>
  );
}
