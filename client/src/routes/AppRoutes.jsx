import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Tasks from "../pages/Tasks.jsx";
import Habits from "../pages/Habits.jsx";
import Scheduler from "../pages/Scheduler.jsx";
import RescueMode from "../pages/RescueMode.jsx";
import Coach from "../pages/Coach.jsx";
import CalendarPage from "../pages/Calendar.jsx";
import Profile from "../pages/Profile.jsx";
import Settings from "../pages/Settings.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/tasks" element={<Tasks />} />
          <Route path="/dashboard/habits" element={<Habits />} />
          <Route path="/dashboard/scheduler" element={<Scheduler />} />
          <Route path="/dashboard/rescue" element={<RescueMode />} />
          <Route path="/dashboard/coach" element={<Coach />} />
          <Route path="/dashboard/calendar" element={<CalendarPage />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}