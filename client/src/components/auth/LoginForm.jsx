import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginRequest } from "../../services/apiClient";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await loginRequest({ email, password });
      login();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2 text-sm font-medium text-slate-200">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          placeholder="admin@test.com"
        />
      </label>

      <label className="block space-y-2 text-sm font-medium text-slate-200">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
          placeholder="test123"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-rose-500/50 bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/40 transition hover:from-cyan-400 hover:to-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Login
      </button>
    </form>
  );
}

export { LoginForm };
