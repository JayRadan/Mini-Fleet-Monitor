import { AppRoutes } from "./app/routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}

export default App;
