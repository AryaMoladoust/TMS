// صحنه بالای داشبورد (بدون متن):
// کامیون بار را از شرکت اول برمی‌دارد، در یک خط مستقیم می‌برد و به شرکت دوم تحویل می‌دهد.
// حرکت‌ها فقط با CSS (transform / opacity) انجام می‌شوند؛ استایل در globals.css (dash-scene).

export default function DeliveryScene() {
  return (
    <section className="dash-scene" aria-hidden="true">
      <svg
        viewBox="0 0 960 200"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* جاده */}
        <rect x="0" y="170" width="960" height="30" fill="rgba(100,116,139,0.4)" />
        <line x1="0" y1="170" x2="960" y2="170" stroke="rgba(100,116,139,0.65)" strokeWidth="2" />
        <line
          x1="0"
          y1="187"
          x2="960"
          y2="187"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeDasharray="26 22"
        />

        {/* شرکت اول (مبدأ) */}
        <rect x="760" y="62" width="120" height="108" fill="#8b5cf6" />
        <rect x="754" y="55" width="132" height="10" rx="2" fill="#6d28d9" />
        <g fill="#ffffff" fillOpacity="0.85">
          <rect x="772" y="78" width="22" height="16" rx="2" />
          <rect x="809" y="78" width="22" height="16" rx="2" />
          <rect x="846" y="78" width="22" height="16" rx="2" fillOpacity="0.35" />
          <rect x="772" y="102" width="22" height="16" rx="2" fillOpacity="0.35" />
          <rect x="809" y="102" width="22" height="16" rx="2" />
          <rect x="846" y="102" width="22" height="16" rx="2" />
        </g>
        <rect x="798" y="130" width="44" height="40" rx="2" fill="#5b21b6" />

        {/* شرکت دوم (مقصد) */}
        <rect x="80" y="70" width="120" height="100" fill="#6366f1" />
        <rect x="74" y="63" width="132" height="10" rx="2" fill="#4338ca" />
        <g fill="#ffffff" fillOpacity="0.85">
          <rect x="92" y="86" width="22" height="16" rx="2" />
          <rect x="129" y="86" width="22" height="16" rx="2" fillOpacity="0.35" />
          <rect x="166" y="86" width="22" height="16" rx="2" />
          <rect x="92" y="108" width="22" height="16" rx="2" fillOpacity="0.35" />
          <rect x="166" y="108" width="22" height="16" rx="2" />
        </g>
        <rect x="118" y="130" width="44" height="40" rx="2" fill="#4338ca" />

        {/* کامیون (رو به چپ) */}
        <g className="dash-scene-truck">
          {/* شاسی و کف کامیون */}
          <rect x="0" y="140" width="150" height="12" rx="3" fill="#334155" />

          {/* بار */}
          <g className="dash-scene-crate">
            <rect x="83" y="104" width="36" height="36" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <rect x="98" y="104" width="6" height="36" fill="#b45309" fillOpacity="0.5" />
            <rect x="83" y="118" width="36" height="5" fill="#b45309" fillOpacity="0.35" />
          </g>

          {/* تخته کناری */}
          <rect x="52" y="128" width="98" height="12" rx="2" fill="#2563eb" />

          {/* کابین */}
          <rect x="0" y="116" width="20" height="24" rx="4" fill="#0d9488" />
          <rect x="18" y="100" width="36" height="40" rx="6" fill="#14b8a6" />
          <rect x="23" y="106" width="22" height="16" rx="3" fill="#ccfbf1" />
          <circle cx="5" cy="128" r="3" fill="#fde047" />
          <rect x="-2" y="134" width="8" height="6" rx="2" fill="#475569" />

          {/* چرخ‌ها */}
          <circle cx="34" cy="155" r="15" fill="#1e293b" />
          <circle cx="34" cy="155" r="6" fill="#cbd5e1" />
          <circle cx="122" cy="155" r="15" fill="#1e293b" />
          <circle cx="122" cy="155" r="6" fill="#cbd5e1" />
        </g>
      </svg>
    </section>
  );
}
