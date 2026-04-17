export default function ProgressBar({ progress, color = 'var(--primary)', height = 6 }) {
  return (
    <div className="progress-bar" style={{ height }}>
      <div 
        className="progress-fill" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: color }}
      ></div>
    </div>
  );
}
