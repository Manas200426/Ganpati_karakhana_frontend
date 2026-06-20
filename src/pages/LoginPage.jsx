import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import DeepKalaLogo from "../assets/DeepKalaMandirLogo.jpeg";
import { toast } from "sonner";
import axios from "axios";

// Inline styles to avoid Tailwind conflicts for animation-heavy elements
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Soft radial ambient blobs */
  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 20%, rgba(76, 29, 149, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(109, 40, 217, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Splash screen ── */
  .splash {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #f8fafc;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .splash.fade-out {
    opacity: 0;
    transform: scale(1.04);
    pointer-events: none;
  }
  .splash.hidden { display: none; }

  .splash-logo-wrap {
    position: relative;
    width: 170px;
    height: 170px;
    animation: splashPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }
  @keyframes splashPop {
    from { opacity: 0; transform: scale(0.4) rotate(-10deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .splash-ring {
    position: absolute;
    inset: -18px;
    border-radius: 50%;
    border: 3px solid rgba(76, 29, 149, 0.18);
    animation: ringExpand 1.4s ease-out 0.6s infinite;
  }
  .splash-ring:nth-child(2) { animation-delay: 0.9s; inset: -30px; border-color: rgba(76, 29, 149, 0.1); }

  @keyframes ringExpand {
    0%   { transform: scale(0.85); opacity: 0.8; }
    100% { transform: scale(1.5);  opacity: 0; }
  }

  .splash-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 8px 32px rgba(76, 29, 149, 0.25));
  }

  .splash-tagline {
    margin-top: 20px;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--color-primary);
    letter-spacing: 0.08em;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.8s forwards;
  }
  .splash-sub {
    margin-top: 6px;
    font-size: 0.78rem;
    color: var(--color-muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeUp 0.6s ease 1s forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Main login card ── */
  .login-card-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: 16px;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .login-card-wrap.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .login-card {
    background: var(--color-surface);
    border-radius: 24px;
    padding: 36px 32px 32px;
    box-shadow:
      0 1px 2px rgba(76,29,149,0.04),
      0 8px 24px rgba(76,29,149,0.08),
      0 32px 64px rgba(76,29,149,0.06);
    border: 1px solid rgba(76, 29, 149, 0.08);
  }

  /* Logo inside form */
  .form-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }
  .form-logo-img {
    width: 88px;
    height: 88px;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 4px 16px rgba(76, 29, 149, 0.2));
    animation: formLogoFloat 4s ease-in-out infinite;
  }
  @keyframes formLogoFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }

  .form-org-name {
    margin-top: 12px;
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    text-align: center;
    letter-spacing: 0.02em;
  }
  .form-org-sub {
    margin-top: 3px;
    font-size: 0.72rem;
    color: var(--color-muted);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
  .divider-text {
    font-size: 0.7rem;
    color: var(--color-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Fields */
  .field-wrap {
    margin-bottom: 16px;
  }
  .field-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--color-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .field-inner {
    position: relative;
  }
  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-muted);
    pointer-events: none;
    width: 16px;
    height: 16px;
  }
  .field-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px 12px 42px;
    border: 1.5px solid var(--color-border);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: var(--color-text);
    background: #fafbff;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .field-input:focus {
    border-color: var(--color-primary-light);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.08);
  }
  .field-input::placeholder { color: #b0b8cc; }

  /* Submit button */
  .submit-btn {
    width: 100%;
    margin-top: 8px;
    padding: 13px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 4px 16px rgba(76, 29, 149, 0.3);
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(76, 29, 149, 0.4);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.12), transparent);
    pointer-events: none;
  }

  /* Loading spinner */
  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 0.72rem;
    color: var(--color-muted);
    letter-spacing: 0.06em;
  }

  /* Mobile tweaks */
  @media (max-width: 480px) {
    .login-card { padding: 28px 20px 24px; border-radius: 20px; }
    .form-logo-img { width: 72px; height: 72px; }
    .form-org-name { font-size: 1.1rem; }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [splashState, setSplashState] = useState("visible"); // visible | fading | hidden
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // After 2.2s start fading splash, then show form
    const t1 = setTimeout(() => setSplashState("fading"), 2200);
    const t2 = setTimeout(() => {
      setSplashState("hidden");
      setCardVisible(true);
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      setAuth(response.data.data);
      toast.success("Login successful! Redirecting...");
      console.log("response", response.data);
      console.log("store before navigate", useAuthStore.getState());
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* ── Splash Screen ── */}
      {splashState !== "hidden" && (
        <div className={`splash ${splashState === "fading" ? "fade-out" : ""}`}>
          <div className="splash-logo-wrap">
            <div className="splash-ring" />
            <div className="splash-ring" style={{ animationDelay: "0.3s" }} />
            <img
              src={DeepKalaLogo}
              alt="Deep Kala Mandir"
              className="splash-logo"
            />
          </div>
          <p className="splash-tagline">दिप कला मंदिर</p>
          <p className="splash-sub">Ganpati Karkhana</p>
        </div>
      )}

      {/* ── Login Page ── */}
      <div className="login-root">
        <div className={`login-card-wrap ${cardVisible ? "visible" : ""}`}>
          <div className="login-card">
            {/* Logo inside form */}
            <div className="form-logo-wrap">
              <img
                src={DeepKalaLogo}
                alt="Deep Kala Mandir"
                className="form-logo-img"
              />
              <p className="form-org-name">दिप कला मंदिर</p>
              <p className="form-org-sub">Ganpati Karkhana</p>
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">Sign in to continue</span>
              <span className="divider-line" />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field-wrap">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <div className="field-inner">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-wrap">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="field-inner">
                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Logging in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="login-footer">
              © {new Date().getFullYear()} Deep Kala Mandir · All rights
              reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
