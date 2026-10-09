import { ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../config/api.js";
import { useAuthStore } from "./AuthStore.js";

export default function AccountForm({ mode }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const signIn = useAuthStore((state) => state.signIn);
  const location = useLocation();
  const navigate = useNavigate();

  if (token) return <Navigate to="/templates" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { name, email, password }
        : { email, password };
      const { data } = await api.post(endpoint, payload);
      signIn(data);
      navigate(location.state?.from || "/templates", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-side-art">
        <Link className="brand auth-brand" to="/templates">
          <span className="brand-mark">
            <Layers3 size={19} />
          </span>
          <span>
            forma<span className="brand-period">.</span>
          </span>
        </Link>
        <div className="auth-quote">
          <span className="quote-mark">“</span>
          <h2>
            Every great thing
            <br />
            starts somewhere.
          </h2>
          <p>Find your starting point, then make it your own.</p>
        </div>
        <span className="auth-side-foot">TEMPLATES FOR THE CURIOUS</span>
      </div>
      <div className="auth-main">
        <Link className="back-link" to="/templates">
          <ArrowLeft size={15} /> Back to exploring
        </Link>
        <div className="auth-form-wrap">
          <div className="eyebrow muted-eyebrow">
            {isRegister ? "YOUR NEXT CHAPTER" : "WELCOME BACK"}
          </div>
          <h1>{isRegister ? "A fresh start." : "Good to see you."}</h1>
          <p className="auth-subtitle">
            {isRegister
              ? "Make an account to save the templates you love."
              : "Log in to pick up where you left off."}
          </p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                Your name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  isRegister ? "At least 8 characters" : "Your password"
                }
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                minLength={isRegister ? 8 : 1}
                maxLength={72}
              />
            </label>
            {error && (
              <div className="notice notice-error" role="alert">
                {error}
              </div>
            )}
            <button
              className="button button-dark auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "One moment..."
                : isRegister
                  ? "Create my account"
                  : "Log in"}{" "}
              <ArrowUpRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to Forma?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
