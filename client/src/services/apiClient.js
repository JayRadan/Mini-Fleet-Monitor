const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const loginRequest = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

const getRobots = async () => {
  const response = await fetch(`${API_BASE_URL}/robots`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load robots");
  }

  return response.json();
};  

const changeRobotStatus = async (id,status) => {
  console.log("changeRobotStatus", id, status);
  const response = await fetch(`${API_BASE_URL}/robots/${id}/change-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return response.json();
}

const validateSession = async () => {
  const response = await fetch(`${API_BASE_URL}/robots`, {
    method: "GET",
    credentials: "include",
  });

  return response.ok;
}

export { API_BASE_URL, getRobots, loginRequest, validateSession, changeRobotStatus };
