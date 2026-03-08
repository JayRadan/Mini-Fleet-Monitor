import { RobotsContext } from "../context/RobotsContext";
import {useContext} from "react";

const useRobots= ()=> {
  const context = useContext(RobotsContext);
  if (!context) {
    throw new Error("useRobots must be used inside RobotsProvider");
  }
  return context;
}   
export { useRobots };