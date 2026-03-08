import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRobots } from "../services/apiClient";
import { createRobotSocket } from "../services/wsClient";

const RobotsContext = createContext(null);

function upsertRobot(list, incomingRobot) {
    const index = list.findIndex((item) => item.id === incomingRobot.id);
    if (index === -1) {
        return [...list, incomingRobot];
    }

    const next = [...list];
    next[index] = incomingRobot;
    return next;
}

function RobotsProvider({ children }) {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const [robots, setRobots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRobot, setSelectedRobot] = useState(null);

    useEffect(() => {
        const loadInitialRobots = async () => {
            if (isAuthLoading) {
                return;
            }

            if (!isAuthenticated) {
                setRobots([]);
                setSelectedRobot(null);
                setError("");
                setIsLoading(false);
                return;
            }

            try {
                setError("");
                setIsLoading(true);
                const initialData = await getRobots();
                setRobots(initialData);
            } catch (err) {
                setError(err.message || "Failed to fetch robots");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialRobots();
    }, [isAuthenticated, isAuthLoading]);

    useEffect(() => {
        if (isAuthLoading || !isAuthenticated) {
            return;
        }

        const socket = createRobotSocket({
            onMessage: (payload) => {
                if (payload?.type === "robot:update" && payload?.data) {
                    setRobots((prev) => upsertRobot(prev, payload.data));
                }
            },
        });

        return () => {
            socket.close();
        };
    }, [isAuthenticated, isAuthLoading]);

    const value = useMemo(
        () => ({ robots, setRobots, isLoading, error, selectedRobot, setSelectedRobot }),
        [robots, isLoading, error, selectedRobot]
    );

    return (
        <RobotsContext.Provider value={value}>{children}</RobotsContext.Provider>
    );
}

export { RobotsContext, RobotsProvider };