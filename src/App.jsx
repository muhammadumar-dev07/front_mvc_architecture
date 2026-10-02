import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login/Login.jsx";
import ProductManagement from "./pages/ProductManagement/ProductManagement.jsx";
import Signup from "./pages/Signup/Signup.jsx";

function App() {
  return (
    <Routes>
      {/* Send the base URL to the public login page. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Require a stored JWT before showing product management. */}
      <Route
        path="/products"
        element={(
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        )}
      />

      {/* Authentication pages. */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Send unknown paths to the public login page. */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;