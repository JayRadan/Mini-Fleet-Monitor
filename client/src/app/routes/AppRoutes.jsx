import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { AuthProvider } from "../../context/AuthContext";
import { RobotsProvider } from "../../context/RobotsContext";
import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";

function AppRoutes() {
  return (
    <AuthProvider>
      <RobotsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </RobotsProvider>
    </AuthProvider>
  );
}

export { AppRoutes };
