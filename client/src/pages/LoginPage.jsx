import { LoginForm } from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-14 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl sm:-left-10" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl sm:-right-8" />
      </div>

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-7 shadow-2xl shadow-slate-950/60 backdrop-blur-md sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">
            Operations Console
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Mini Fleet Monitor</h1>
          <p className="text-sm text-slate-300">
            Sign in to access your live robot fleet dashboard.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

export { LoginPage };
