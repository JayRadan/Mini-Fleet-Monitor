import { RobotsContext } from "../../context/RobotsContext";
import { useContext } from "react";
import { changeRobotStatus } from "../../services/apiClient";
import { toast } from "react-toastify";
const RobotList = () => {
  const { robots, setSelectedRobot, selectedRobot, isLoading } = useContext(RobotsContext);

  const handleChangeRobotStatus = async (event, id, status) => {
    try {
      event.stopPropagation();
      await changeRobotStatus(id, status);
      toast.success("Robot status changed successfully");
    } catch (error) {
      console.error("Error changing robot status:", error);
      toast.error("Error changing robot status");
    }
  };

  return (
    <section className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Robots</h2>
        <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300">
          {robots.length} total
        </span>
      </div>

      {isLoading ? <p className="mb-3 text-sm text-slate-400">Loading robots...</p> : null}

      <ul className="space-y-3">
        {robots.map((robot) => (
          <li
            onClick={() => setSelectedRobot(robot)}
            key={robot.id}
            className={`cursor-pointer rounded-xl border p-3 transition ${
              robot.id === selectedRobot?.id
                ? "border-cyan-400/60 bg-cyan-500/10 shadow-inner shadow-cyan-500/10"
                : "border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white">{robot.name}</p>
                <p className="text-xs text-slate-300">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      robot.status === "moving" ? "text-emerald-300" : "text-amber-200"
                    }`}
                  >
                    {robot.status}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Position: {Number(robot.lat).toFixed(5)}, {Number(robot.lon).toFixed(5)}
                </p>
              </div>
              <button
                onClick={(event) =>
                  handleChangeRobotStatus(
                    event,
                    robot.id,
                    robot.status === "moving" ? "stopped" : "moving"
                  )
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition ${
                  robot.status === "moving"
                    ? "bg-rose-500 hover:bg-rose-400"
                    : "bg-cyan-600 hover:bg-cyan-500"
                }`}
              >
                {robot.status === "moving" ? "Stop" : "Move"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export { RobotList };
