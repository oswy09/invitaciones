import { useState } from "react";
import { authClient } from "../lib/authClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await authClient.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Email o contraseña incorrectos.");
    // Si fue exitoso, App.tsx escucha onAuthStateChange y muestra el dashboard.
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800 text-center">📋 Admin · Invitaciones</h1>

        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Email</label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
