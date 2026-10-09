import { ArrowUpRight, Heart, Layers3, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore.js";

export default function SiteLayout() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    signOut();
    setMenuOpen(false);
    navigate("/templates");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-inner">
          <Link className="brand" to="/templates" aria-label="Forma home">
            <span className="brand-mark">
              <Layers3 size={19} strokeWidth={2.2} />
            </span>
            <span>
              forma<span className="brand-period">.</span>
            </span>
          </Link>
          <button
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>
            <NavLink to="/templates" onClick={() => setMenuOpen(false)}>
              Explore
            </NavLink>
            {user && (
              <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                <Heart size={15} /> My favorites
              </NavLink>
            )}
            <div className="nav-actions">
              {user ? (
                <>
                  <span className="welcome-name">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button
                    className="button button-quiet button-small"
                    onClick={logout}
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="sign-in-link"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    className="button button-dark button-small"
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create account <ArrowUpRight size={15} />
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <Link className="footer-brand" to="/templates">
          forma<span className="brand-period">.</span>
        </Link>
        <span>A little inspiration for what you'll make next.</span>
        <span className="footer-right">
          Made for makers <span>✳</span>
        </span>
      </footer>
    </div>
  );
}
