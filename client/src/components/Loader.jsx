export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-text-secondary">
      <span className="h-4 w-4 rounded-full border-2 border-border border-t-brand animate-spin" />
      <span className="font-mono text-sm">{label}</span>
    </div>
  );
}
