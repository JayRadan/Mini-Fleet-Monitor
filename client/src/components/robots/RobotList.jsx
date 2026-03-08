import { RobotsContext } from "../../context/RobotsContext";
import { useContext } from "react";
import { changeRobotStatus } from "../../services/apiClient";
import { toast } from "react-toastify";
const  RobotList = () => {
  const { robots,setSelectedRobot ,selectedRobot ,isLoading } = useContext(RobotsContext);
  
  const handleChangeRobotStatus = async (event, id, status) => {
    try {
      event.stopPropagation();
      await changeRobotStatus(id,status);
      toast.success("Robot status changed successfully");
    } catch (error) {
      console.error("Error changing robot status:", error);
      toast.error("Error changing robot status");
    }
  }

  return (
    <section className="panel list-panel">
      <div  className="panel-header">
        <h2 className="">Robots</h2>
      </div>

      {isLoading ? <p>Loading robots...</p> : null}

      <ul className="robot-list">
        {robots.map((robot) => (
          <li
            onClick={() => setSelectedRobot(robot)}
            key={robot.id}
            className={`robot-row cursor-pointer ${
              robot.id === selectedRobot?.id ? "bg-red-100 border-red-300" : ""
            }`}
          >
          <div className="flex items-center justify-between gap-2 p-2">
             <div className="flex flex-col items-start justify-between gap-2">
              <p className="robot-name">{robot.name}</p>
              <p>Status: {robot.status}</p>
              <p className="">
                Position: {Number(robot.lat).toFixed(5)}, {Number(robot.lon).toFixed(5)}
              </p>
             </div>
             <button 
             onClick={(event) => handleChangeRobotStatus(event, robot.id, robot.status === "moving" ? "stopped" : "moving")} 
             className={`text-white px-2 py-1 rounded-md 
              ${robot.status === "moving" ? "bg-red-500" : "bg-blue-500"}`}
             >
              {robot.status === "moving" ? "Stop it" : "Move it"}
             </button>

            </div>

          </li>
        ))}
      </ul>
    </section>
  );
};

export { RobotList };
