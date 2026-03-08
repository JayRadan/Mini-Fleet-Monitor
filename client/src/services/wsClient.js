import { API_BASE_URL } from "./apiClient";

function createRobotSocket({ onMessage, onOpen, onClose }) {
  const wsBase = API_BASE_URL.replace(/^http/, "ws");
  const socket = new WebSocket(`${wsBase}/ws`);

  socket.onopen = () => onOpen?.();
  socket.onclose = () => onClose?.();
  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage?.(payload);
    } catch {
      // Ignore malformed payloads.
    }
  };

  return socket;
}

export { createRobotSocket };
