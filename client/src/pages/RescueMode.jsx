import { useEffect, useState } from "react";
import { LifeBuoy, RefreshCw, ShieldCheck } from "lucide-react";
import RescueCard from "../components/RescueCard.jsx";
import Loader from "../components/Loader.jsx";
import { scanRisk } from "../services/rescueService";

export default function RescueMode() {
  const [atRisk, setAtRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  async function runScan() {
    setScanning(true);
    try {
      const results = await scanRisk();
      setAtRisk(results);
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    runScan().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Scanning deadlines..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-risk-critical/10 text-risk-critical">
            <LifeBuoy size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Rescue Mode</h1>
            <p className="text-text-secondary">Deadline recovery planning for tasks running out of road.</p>
          </div>
        </div>
        <button onClick={runScan} disabled={scanning} className="btn-secondary">
          <RefreshCw size={16} className={scanning ? "animate-spin" : ""} />
          Rescan
        </button>
      </div>

      {atRisk.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <ShieldCheck className="text-risk-safe" size={28} />
          <p className="font-medium">Nothing at risk right now.</p>
          <p className="text-sm text-text-tertiary">Every pending task has a comfortable buffer before its deadline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {atRisk.map((entry) => (
            <RescueCard key={entry.task._id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
