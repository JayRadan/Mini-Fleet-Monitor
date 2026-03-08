import { RobotMap } from "../components/map/RobotMap";
import { RobotList } from "../components/robots/RobotList";
import { useRobots } from "../hooks/useRobots";

function DashboardPage() {
  const { robots, isLoading, error } = useRobots();
  const movingCount = robots.filter((robot) => robot.status === "moving").length;
  const stoppedCount = robots.length - movingCount;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
                Fleet Overview
              </p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Fleet Dashboard</h1>
              <p className="text-sm text-slate-300">Live robot positions and status feed.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-emerald-300">Moving</p>
                <p className="text-lg font-semibold text-emerald-200">{movingCount}</p>
              </div>
              <div className="rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-slate-300">Stopped</p>
                <p className="text-lg font-semibold text-slate-100">{stoppedCount}</p>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            Fetching live fleet data...
          </div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <RobotMap robots={robots} isLoading={isLoading} />
          <RobotList />
        </section>
      </div>
    </main>
  );
}

export { DashboardPage };
