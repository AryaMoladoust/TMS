export default function AnimatedTruck() {
  return (
    <div className="stats-truck" aria-hidden="true">
      <svg viewBox="0 0 420 240" fill="none">
        <ellipse cx="210" cy="216" rx="190" ry="8" fill="#0f172a" opacity=".12" />
        <rect x="150" y="46" width="250" height="132" rx="14" fill="#2563eb" />
        <rect x="172" y="76" width="140" height="14" rx="7" fill="#fff" opacity=".92" />
        <rect x="172" y="102" width="92" height="10" rx="5" fill="#5eead4" />
        <rect x="172" y="124" width="60" height="10" rx="5" fill="#93c5fd" />
        <path d="M40 100a12 12 0 0 1 12-12h86v90H40z" fill="#14b8a6" />
        <path d="M52 100h68v38H52z" fill="#e0f2fe" />
        <rect x="26" y="160" width="130" height="20" rx="8" fill="#334155" />
        <circle cx="40" cy="150" r="6" fill="#fde047" />
        <rect x="30" y="176" width="370" height="10" rx="4" fill="#334155" />
        {[92, 236, 330].map((x) => (
          <g key={x}>
            <circle cx={x} cy="190" r="24" fill="#334155" />
            <circle cx={x} cy="190" r="10" fill="#cbd5e1" />
          </g>
        ))}
        <line
          x1="0" y1="222" x2="420" y2="222"
          stroke="#94a3b8" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="26 26" className="stats-truck-road"
        />
      </svg>
    </div>
  );
}
