export default function StatStrip({ stats }) {
  return (
    <div className="stat-strip">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <span className={`stat-value${s.tone ? ` stat-${s.tone}` : ''}`}>
            {s.value}
          </span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
