import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TimerReset } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 flex items-center gap-2 font-display text-xl font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <TimerReset size={18} />
        </span>
        Create your account
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <p className="rounded-lg bg-risk-critical/10 px-3 py-2 text-sm text-risk-critical">{error}</p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
