import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/dashboard/Dashboard";

import Projects from "./pages/projects/Projects";
import ProjectOverview from "./pages/projects/ProjectOverview";

import DigitalTwin from "./pages/twin/DigitalTwin";
import Simulations from "./pages/simulation/Simulations";
import SimulationDetails from "./pages/simulation/SimulationDetails";
import SimulationResults from "./pages/simulation/SimulationResults";
import RedAgent from "./pages/red-agent/RedAgent";
import BlueSOC from "./pages/blue-soc/BlueSOC";
import PurpleAnalysis from "./pages/purple-analysis/PurpleAnalysis";
import Incidents from "./pages/incidents/Incidents";
import Vulnerabilities from "./pages/vulnerabilities/Vulnerabilities";
import MitreAttack from "./pages/mitre/MitreAttack";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            APPLICATION
        ========================= */}

        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/:projectId"
            element={<ProjectOverview />}
          />

          <Route
            path="/digital-twin/:twinId"
            element={<DigitalTwin />}
          />

          <Route
            path="/simulations"
            element={<Simulations />}
          />

          <Route
            path="/simulations/:simulationId"
            element={<SimulationDetails />}
          />

          <Route
            path="/simulations/:simulationId/results"
            element={<SimulationResults />}
          />

          <Route
            path="/red-agent"
            element={<RedAgent />}
          />

          <Route
            path="/blue-soc"
            element={<BlueSOC />}
          />

          <Route
            path="/purple-analysis"
            element={<PurpleAnalysis />}
          />

          <Route
            path="/incidents"
            element={<Incidents />}
          />

          <Route
            path="/vulnerabilities"
            element={<Vulnerabilities />}
          />

          <Route
            path="/mitre-attack"
            element={<MitreAttack />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>


        {/* =========================
            DEFAULT ROUTES
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;