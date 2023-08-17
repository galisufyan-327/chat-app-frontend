import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute"
import { useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import { useUserContext } from "./context/useUserContext";

function App() {
  const { userData } = useUserContext();
  const { newUser } = useSocket();

  useEffect(() => {
    if (userData?.id) newUser(userData.id);
  }, [userData]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/" element={<PrivateRoute element={Home} />} />
      </Routes>
    </div>
  );
}

export default App;
