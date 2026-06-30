import { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView.jsx";
import Loader from "../components/Loader.jsx";
import { fetchTasks } from "../api/taskApi";

export default function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks()
      .then(({ tasks }) => setTasks(tasks))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading deadlines..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Calendar</h1>
        <p className="text-text-secondary">Every deadline, mapped to the day it's due.</p>
      </div>
      <CalendarView tasks={tasks} />
    </div>
  );
}
