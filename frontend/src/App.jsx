import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Home />} />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route
      path="/patient/dashboard"
      element={
        <ProtectedRoute allowedRoles={["PATIENT"]}>
          <PatientDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/doctor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["MEDECIN"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
</BrowserRouter>


);
}

export default App;
