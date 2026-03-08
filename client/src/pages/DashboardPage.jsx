import { RobotMap } from "../components/map/RobotMap";
import { RobotList } from "../components/robots/RobotList";
import { useRobots } from "../context/RobotsContext";

function DashboardPage() {
  const { robots, isLoading, error } = useRobots();

  return (
    <main className="page page-dashboard">
      <header className="dashboard-header">
        <h1>Fleet Dashboard</h1>
        <p>Live robot positions and status feed.</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="dashboard-grid">
        <RobotMap robots={robots} isLoading={isLoading} />
        <RobotList />
      </section>
    </main>
  );
}

export { DashboardPage };
