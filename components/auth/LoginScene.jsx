/*
 * Illustration for the login page (/auth/login).
 * Pure SVG + CSS (see "LOGIN – scene" in globals.css). No logic lives here.
 */

/* To use a real picture of the Nissan instead of the drawing below, put a
   transparent PNG (side view, front facing right) in /public/images and set
   e.g. "/images/nissan.png". Leave null to keep the drawn pickup. */
const NISSAN_PHOTO = null;

export function LoginScene() {
    return (
        <svg className="login-hero-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
        <linearGradient id="lsSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fb6e6"/><stop offset="0.42" stopColor="#b9d9f1"/><stop offset="0.72" stopColor="#e3eef6"/><stop offset="1" stopColor="#f7efe2"/>
        </linearGradient>
        <radialGradient id="lsSun" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fffdf5" stopOpacity="0.95"/><stop offset="0.25" stopColor="#fff6dc" stopOpacity="0.55"/><stop offset="1" stopColor="#fff6dc" stopOpacity="0"/></radialGradient>
        <linearGradient id="lsFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fa9c8"/><stop offset="1" stopColor="#c3d4e6"/></linearGradient>
        <linearGradient id="lsMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f8fb0"/><stop offset="1" stopColor="#a9c0d6"/></linearGradient>
        <linearGradient id="lsHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f8f80"/><stop offset="1" stopColor="#7fa89a"/></linearGradient>
        <linearGradient id="lsHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4c7d6c"/><stop offset="1" stopColor="#6f9c8b"/></linearGradient>
        <linearGradient id="lsHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f1e8" stopOpacity="0"/><stop offset="1" stopColor="#f4f1e8" stopOpacity="0.85"/></linearGradient>
        <linearGradient id="lsApron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd5dd"/><stop offset="1" stopColor="#a3adba"/></linearGradient>
        <linearGradient id="lsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1f4f8"/><stop offset="1" stopColor="#d6dde6"/></linearGradient>
        <linearGradient id="lsRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c3cdda"/><stop offset="1" stopColor="#8996a8"/></linearGradient>
        <linearGradient id="lsGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9fd0ee"/><stop offset="0.55" stopColor="#4f7fa8"/><stop offset="1" stopColor="#2e5273"/></linearGradient>
        <linearGradient id="lsTank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9aa8ba"/><stop offset="0.35" stopColor="#f6f8fb"/><stop offset="1" stopColor="#8793a5"/></linearGradient>
        <linearGradient id="lsShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1730" stopOpacity="0.34"/><stop offset="1" stopColor="#0b1730" stopOpacity="0"/></linearGradient>
        <linearGradient id="lsDoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4e9ef"/><stop offset="1" stopColor="#bcc6d2"/></linearGradient>
        <linearGradient id="lsInterior" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2433"/><stop offset="1" stopColor="#3a475c"/></linearGradient>
        <pattern id="lsCorr" width="9" height="10" patternUnits="userSpaceOnUse"><rect width="9" height="10" fill="#ffffff" fillOpacity="0"/><rect width="2" height="10" fill="#7a8899" fillOpacity="0.16"/><rect x="2" width="2" height="10" fill="#ffffff" fillOpacity="0.35"/></pattern>
        <pattern id="lsSlats" width="10" height="7" patternUnits="userSpaceOnUse"><rect width="10" height="7" fill="none"/><rect y="5.5" width="10" height="1.5" fill="#5d6a7b" fillOpacity="0.35"/><rect y="0" width="10" height="1" fill="#ffffff" fillOpacity="0.5"/></pattern>
        <pattern id="lsHazard" width="14" height="8" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)"><rect width="14" height="8" fill="#f2b705"/><rect width="7" height="8" fill="#1b2230"/></pattern>
        <pattern id="lsRib" width="7" height="30" patternUnits="userSpaceOnUse"><rect width="7" height="30" fill="none"/><rect width="2" height="30" fill="#000" fillOpacity="0.18"/><rect x="2" width="1.4" height="30" fill="#fff" fillOpacity="0.16"/></pattern>
        <linearGradient id="lsRay" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="720"><stop offset="0" stopColor="#fffbe8" stopOpacity="0.34"/><stop offset="1" stopColor="#fffbe8" stopOpacity="0"/></linearGradient>
        <filter id="lsBlur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="lsBlurS" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
        </defs>
        <rect width="1440" height="900" fill="url(#lsSky)"/>
        <circle cx="1130" cy="205" r="360" fill="url(#lsSun)"/>
        <circle cx="1130" cy="205" r="34" fill="#fffdf4" fillOpacity="0.9"/>
        <g transform="translate(250 150) scale(1.0)" opacity="0.95"><g filter="url(#lsBlur)"><ellipse cx="0" cy="14" rx="150" ry="20" fill="#9fb6cf" fillOpacity="0.55"/></g><g filter="url(#lsBlurS)" fill="#ffffff"><ellipse cx="-80" cy="6" rx="62" ry="20"/><ellipse cx="-30" cy="-8" rx="70" ry="30"/><ellipse cx="30" cy="-16" rx="66" ry="34"/><ellipse cx="82" cy="0" rx="60" ry="24"/><ellipse cx="0" cy="8" rx="120" ry="18"/></g></g>
        <g transform="translate(620 90) scale(0.7)" opacity="0.8"><g filter="url(#lsBlur)"><ellipse cx="0" cy="14" rx="150" ry="20" fill="#9fb6cf" fillOpacity="0.55"/></g><g filter="url(#lsBlurS)" fill="#ffffff"><ellipse cx="-80" cy="6" rx="62" ry="20"/><ellipse cx="-30" cy="-8" rx="70" ry="30"/><ellipse cx="30" cy="-16" rx="66" ry="34"/><ellipse cx="82" cy="0" rx="60" ry="24"/><ellipse cx="0" cy="8" rx="120" ry="18"/></g></g>
        <g transform="translate(900 250) scale(0.55)" opacity="0.7"><g filter="url(#lsBlur)"><ellipse cx="0" cy="14" rx="150" ry="20" fill="#9fb6cf" fillOpacity="0.55"/></g><g filter="url(#lsBlurS)" fill="#ffffff"><ellipse cx="-80" cy="6" rx="62" ry="20"/><ellipse cx="-30" cy="-8" rx="70" ry="30"/><ellipse cx="30" cy="-16" rx="66" ry="34"/><ellipse cx="82" cy="0" rx="60" ry="24"/><ellipse cx="0" cy="8" rx="120" ry="18"/></g></g>
        <g transform="translate(1330 120) scale(0.8)" opacity="0.85"><g filter="url(#lsBlur)"><ellipse cx="0" cy="14" rx="150" ry="20" fill="#9fb6cf" fillOpacity="0.55"/></g><g filter="url(#lsBlurS)" fill="#ffffff"><ellipse cx="-80" cy="6" rx="62" ry="20"/><ellipse cx="-30" cy="-8" rx="70" ry="30"/><ellipse cx="30" cy="-16" rx="66" ry="34"/><ellipse cx="82" cy="0" rx="60" ry="24"/><ellipse cx="0" cy="8" rx="120" ry="18"/></g></g>
        <g filter="url(#lsBlurS)" fill="url(#lsRay)">
        <polygon points="1130,205 490,720 710,720"/>
        <polygon points="1130,205 660,720 800,720"/>
        <polygon points="1130,205 800,720 890,720"/>
        <polygon points="1130,205 940,720 990,720"/>
        <polygon points="1130,205 1070,720 1110,720"/>
        </g>
        <path d="M372 206 q5.0 -5.0 10.0 0 q5.0 -5.0 10.0 0" fill="none" stroke="#33465f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M404 190 q4.0 -4.0 8.0 0 q4.0 -4.0 8.0 0" fill="none" stroke="#33465f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M432 214 q3.5 -3.5 7.0 0 q3.5 -3.5 7.0 0" fill="none" stroke="#33465f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M1272 330 q4.5 -4.5 9.0 0 q4.5 -4.5 9.0 0" fill="none" stroke="#33465f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M1306 312 q3.5 -3.5 7.0 0 q3.5 -3.5 7.0 0" fill="none" stroke="#33465f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M-20,358.9 L-2,348.2 L16,331.1 L34,347.3 L52,361 L70,364.1 L88,378.6 L106,382.9 L124,377.1 L142,383.1 L160,406.2 L178,420 L196,421.9 L214,411.7 L232,391.6 L250,365.5 L268,407 L286,446.8 L304,476.6 L322,494.1 L340,499.4 L358,494.6 L376,504.2 L394,527.1 L412,539.1 L430,537.9 L448,523 L466,496.4 L484,464.1 L502,466.3 L520,461.6 L538,448.6 L556,456.6 L574,454.1 L592,443.2 L610,451.2 L628,470.2 L646,479 L664,474.9 L682,457.3 L700,428.2 L718,396.2 L736,395.1 L754,386 L772,366 L790,334.4 L808,292.7 L826,259.7 L844,295.3 L862,341.2 L880,378.5 L898,404.2 L916,417.7 L934,420.5 L952,423.8 L970,454.6 L988,476.3 L1006,485.6 L1024,481.5 L1042,465.4 L1060,440.6 L1078,441 L1096,447.3 L1114,455.3 L1132,475.6 L1150,484.6 L1168,484 L1186,487.5 L1204,515.9 L1222,534.9 L1240,541.1 L1258,533.3 L1276,512.8 L1294,482.8 L1312,479.7 L1330,477.8 L1348,465.5 L1366,441.2 L1384,405.9 L1402,377.2 L1420,376.5 L1438,399.5 L1456,414.6 L1460,910 L-20,910 Z" fill="url(#lsFar)"/>
        <path d="M16,331.1 L34,347.3 L52,361 L70,364.1 L88,378.6 L106,382.9 L32.2,387.6 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M124,377.1 L142,383.1 L160,406.2 L178,420 L196,421.9 L137,429.7 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M250,365.5 L268,407 L286,446.8 L304,476.6 L322,494.1 L340,499.4 L266.2,467.2 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M592,443.2 L610,451.2 L628,470.2 L646,479 L601.7,490.9 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M826,259.7 L844,295.3 L862,341.2 L880,378.5 L898,404.2 L916,417.7 L934,420.5 L952,423.8 L970,454.6 L988,476.3 L1006,485.6 L858.4,411.9 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M1060,440.6 L1078,441 L1096,447.3 L1114,455.3 L1132,475.6 L1150,484.6 L1076.2,492.8 Z" fill="#3d5878" fillOpacity="0.16"/>
        <path d="M790,334.4 L808,292.7 L826,259.7 L844,295.3 L862,341.2 L856,343.2 L834,291 L828,299.1 L818,289 L796,336.4 Z" fill="#ffffff" fillOpacity="0.82"/>
        <path d="M-20,491.9 L-4,465.6 L12,433.3 L28,412 L44,427.6 L60,438.5 L76,442.1 L92,437.4 L108,440.8 L124,442 L140,461.7 L156,482.1 L172,494.8 L188,498.3 L204,492.9 L220,480.2 L236,470.3 L252,478.8 L268,484.6 L284,506.2 L300,520 L316,526.1 L332,526.2 L348,542 L364,561.2 L380,572.3 L396,573.8 L412,565.4 L428,548.7 L444,530.8 L460,533 L476,529.4 L492,518.3 L508,499.3 L524,497.3 L540,490.6 L556,498 L572,512.4 L588,519.8 L604,518.1 L620,507.1 L636,487.8 L652,464.7 L668,464.1 L684,457.9 L700,444 L716,421.9 L732,403.1 L748,388.3 L764,407.5 L780,441 L796,468.9 L812,488.8 L828,500 L844,503.2 L860,500.5 L876,521.2 L892,536.5 L908,543.3 L924,540.8 L940,529.3 L956,511.1 L972,501.3 L988,504.6 L1004,521.5 L1020,536.8 L1036,543.8 L1052,543 L1068,536.2 L1084,550.4 L1100,562 L1116,565.2 L1132,558.5 L1148,542.4 L1164,518.5 L1180,499.6 L1196,495.6 L1212,485.9 L1228,469.1 L1244,461.1 L1260,454.9 L1276,443.8 L1292,452.3 L1308,462.2 L1324,464.7 L1340,458.4 L1356,448.3 L1372,445 L1388,443.8 L1404,460 L1420,470.3 L1436,472.8 L1452,467.1 L1460,910 L-20,910 Z" fill="url(#lsMid)"/>
        <path d="M28,412 L44,427.6 L60,438.5 L76,442.1 L36.6,455 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M92,437.4 L108,440.8 L124,442 L140,461.7 L156,482.1 L172,494.8 L188,498.3 L109.3,495.9 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M236,470.3 L252,478.8 L268,484.6 L284,506.2 L300,520 L316,526.1 L332,526.2 L348,542 L364,561.2 L380,572.3 L396,573.8 L264.8,550 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M540,490.6 L556,498 L572,512.4 L588,519.8 L548.6,533.2 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M748,388.3 L764,407.5 L780,441 L796,468.9 L812,488.8 L828,500 L844,503.2 L765.3,473.7 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M972,501.3 L988,504.6 L1004,521.5 L1020,536.8 L1036,543.8 L983.5,550.5 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M1068,536.2 L1084,550.4 L1100,562 L1116,565.2 L1076.6,578.7 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M1276,443.8 L1292,452.3 L1308,462.2 L1324,464.7 L1284.6,482.3 Z" fill="#27435f" fillOpacity="0.2"/>
        <path d="M1388,443.8 L1404,460 L1420,470.3 L1436,472.8 L1396.6,486.3 Z" fill="#27435f" fillOpacity="0.2"/>
        <rect x="0" y="380" width="1440" height="220" fill="url(#lsHaze)"/>
        <path d="M-20,574.7 L4,575.9 L28,575.6 L52,574 L76,571.6 L100,569 L124,566.6 L148,564.9 L172,564.1 L196,563.9 L220,564.3 L244,564.6 L268,564.6 L292,563.9 L316,562.4 L340,560.1 L364,557.4 L388,554.7 L412,552.6 L436,551.3 L460,551.3 L484,552.5 L508,554.7 L532,557.5 L556,560.3 L580,562.5 L604,563.6 L628,563.4 L652,561.7 L676,558.9 L700,555.3 L724,551.4 L748,547.7 L772,544.6 L796,542.3 L820,540.7 L844,539.5 L868,538.4 L892,537 L916,534.9 L940,532 L964,528.4 L988,524.4 L1012,520.5 L1036,517.2 L1060,515.2 L1084,514.6 L1108,515.6 L1132,518.2 L1156,521.9 L1180,526.2 L1204,530.4 L1228,534.1 L1252,536.9 L1276,538.7 L1300,539.5 L1324,539.8 L1348,539.9 L1372,540.2 L1396,541.2 L1420,542.8 L1444,545.1 L1460,910 L-20,910 Z" fill="url(#lsHill)"/>
        <path d="M0,582.9 a8.4,10.5 0 0 1 16.9,0 Z M12.6,583.8 a10.3,12.8 0 0 1 20.5,0 Z M28,582.5 a9.2,11.5 0 0 1 18.4,0 Z M41.9,582.3 a10.6,13.3 0 0 1 21.2,0 Z M57.8,580.8 a10.8,13.4 0 0 1 21.5,0 Z M73.9,577.4 a7.4,9.2 0 0 1 14.8,0 Z M85,576.1 a7.1,8.8 0 0 1 14.2,0 Z M95.6,577.4 a12,15 0 0 1 24,0 Z M113.7,573.9 a8.6,10.7 0 0 1 17.1,0 Z M126.5,572.9 a8.4,10.5 0 0 1 16.8,0 Z M139.1,574.6 a13,16.2 0 0 1 25.9,0 Z M158.6,572.1 a9.8,12.3 0 0 1 19.6,0 Z M173.3,573.2 a12,15 0 0 1 24,0 Z M191.3,571.9 a9.9,12.3 0 0 1 19.7,0 Z M206.1,572.7 a10.8,13.5 0 0 1 21.7,0 Z M222.4,571.1 a7.9,9.9 0 0 1 15.8,0 Z M234.2,573.1 a10.8,13.5 0 0 1 21.6,0 Z M250.5,573.9 a12.2,15.3 0 0 1 24.4,0 Z M268.8,572.4 a10.1,12.7 0 0 1 20.3,0 Z M284,572.6 a11.4,14.3 0 0 1 22.9,0 Z M301.1,571.2 a11,13.8 0 0 1 22.1,0 Z M317.7,568 a7.4,9.2 0 0 1 14.8,0 Z M328.8,569 a11.5,14.4 0 0 1 23.1,0 Z M346.1,566.6 a10.5,13.2 0 0 1 21.1,0 Z M361.9,564 a8.8,11 0 0 1 17.6,0 Z M375.1,561.7 a7.2,9 0 0 1 14.4,0 Z M385.9,563.1 a12.2,15.2 0 0 1 24.4,0 Z M404.2,560.4 a9.8,12.3 0 0 1 19.7,0 Z M418.9,560.4 a11.3,14.1 0 0 1 22.6,0 Z M435.9,560.7 a12.3,15.3 0 0 1 24.5,0 Z M454.3,560.3 a11.3,14.1 0 0 1 22.6,0 Z M471.3,562 a12.5,15.7 0 0 1 25.1,0 Z M490,561.5 a9.4,11.7 0 0 1 18.7,0 Z M504.1,564.7 a11.8,14.8 0 0 1 23.6,0 Z M521.8,565.2 a9.7,12.1 0 0 1 19.3,0 Z M536.3,569 a12.6,15.8 0 0 1 25.2,0 Z M555.2,570.7 a12.3,15.3 0 0 1 24.5,0 Z M573.6,569.1 a7.6,9.5 0 0 1 15.2,0 Z M585,569.8 a7.8,9.8 0 0 1 15.6,0 Z M596.7,570.6 a8.3,10.4 0 0 1 16.6,0 Z M609.2,573.1 a12.8,16 0 0 1 25.6,0 Z M628.4,570.4 a9.6,12 0 0 1 19.2,0 Z M642.8,570 a10.8,13.4 0 0 1 21.5,0 Z M658.9,567.1 a8.8,11 0 0 1 17.6,0 Z M672.2,566 a10,12.6 0 0 1 20.1,0 Z M687.2,563.4 a9.3,11.6 0 0 1 18.6,0 Z M701.2,561.1 a9.1,11.4 0 0 1 18.2,0 Z M714.8,559.5 a10.5,13.1 0 0 1 21,0 Z M730.6,557.1 a10.5,13.1 0 0 1 21,0 Z M746.4,555.8 a12.4,15.5 0 0 1 24.9,0 Z M765,552.9 a11.1,13.9 0 0 1 22.2,0 Z M781.6,552 a12.6,15.7 0 0 1 25.1,0 Z M800.5,550.5 a12.1,15.2 0 0 1 24.3,0 Z M818.7,549.9 a12.9,16.2 0 0 1 25.9,0 Z M838.1,547.9 a11,13.8 0 0 1 22.1,0 Z M854.7,545.4 a8,10 0 0 1 16,0 Z M866.6,547.1 a12.2,15.2 0 0 1 24.3,0 Z M884.9,546.1 a12.8,16 0 0 1 25.6,0 Z M904.1,544.3 a12.4,15.5 0 0 1 24.9,0 Z M922.7,541 a10.4,13 0 0 1 20.8,0 Z M938.3,539.3 a11.3,14.1 0 0 1 22.6,0 Z M955.3,535.4 a8.3,10.3 0 0 1 16.5,0 Z M967.7,535 a12,15 0 0 1 24,0 Z M985.6,531.3 a10.4,13.1 0 0 1 20.9,0 Z M1001.3,528 a8.7,10.9 0 0 1 17.4,0 Z M1014.4,525.6 a7.4,9.2 0 0 1 14.8,0 Z M1025.4,526.4 a12.1,15.2 0 0 1 24.2,0 Z M1043.6,525.2 a12.9,16.2 0 0 1 25.9,0 Z M1063,521.4 a7.5,9.4 0 0 1 15.1,0 Z M1074.3,523.8 a11.8,14.8 0 0 1 23.6,0 Z M1092,523 a9.5,11.8 0 0 1 18.9,0 Z M1106.2,523 a7.9,9.9 0 0 1 15.8,0 Z M1118.1,524.9 a8.8,11 0 0 1 17.5,0 Z M1131.2,528.8 a11.6,14.5 0 0 1 23.2,0 Z M1148.7,532.1 a12.2,15.3 0 0 1 24.5,0 Z M1167,531.5 a7.3,9.1 0 0 1 14.5,0 Z M1177.9,536.1 a10.7,13.4 0 0 1 21.4,0 Z M1193.9,536.3 a7.3,9.1 0 0 1 14.5,0 Z M1204.8,541.1 a11.3,14.1 0 0 1 22.6,0 Z M1221.8,541.8 a9,11.2 0 0 1 18,0 Z M1235.3,545.8 a12.3,15.4 0 0 1 24.6,0 Z M1253.7,547.7 a12.9,16.1 0 0 1 25.8,0 Z M1273,546.9 a10,12.5 0 0 1 20.1,0 Z M1288.1,549.3 a13,16.2 0 0 1 26,0 Z M1307.6,547 a8.9,11.1 0 0 1 17.7,0 Z M1320.9,546.3 a7.5,9.3 0 0 1 14.9,0 Z M1332.1,548.2 a10.6,13.2 0 0 1 21.2,0 Z M1348,546.3 a7.2,9 0 0 1 14.4,0 Z M1358.7,547.1 a8.2,10.2 0 0 1 16.4,0 Z M1371,548.2 a9.4,11.8 0 0 1 18.9,0 Z M1385.2,549.6 a10.7,13.3 0 0 1 21.3,0 Z M1401.2,548.9 a7.9,9.9 0 0 1 15.9,0 Z M1413.1,549.2 a7.3,9.1 0 0 1 14.5,0 Z M1424,553.7 a12.2,15.3 0 0 1 24.4,0 Z " fill="#4a7766"/>
        <path d="M-20,579.1 L4,580.6 L28,583 L52,586.4 L76,590.5 L100,594.9 L124,599.4 L148,603.3 L172,606.2 L196,607.9 L220,608.3 L244,607.4 L268,605.6 L292,603.3 L316,600.9 L340,598.8 L364,597.2 L388,596.4 L412,596.2 L436,596.5 L460,596.9 L484,597.3 L508,597.4 L532,597.1 L556,596.4 L580,595.4 L604,594.3 L628,593.3 L652,592.6 L676,592.2 L700,592.1 L724,592 L748,591.7 L772,590.8 L796,589.3 L820,586.9 L844,583.8 L868,580.1 L892,576.3 L916,572.8 L940,570 L964,568.4 L988,568.1 L1012,569.2 L1036,571.4 L1060,574.6 L1084,578.1 L1108,581.7 L1132,584.8 L1156,587.2 L1180,588.9 L1204,589.9 L1228,590.4 L1252,590.7 L1276,591.1 L1300,591.6 L1324,592.4 L1348,593.5 L1372,594.7 L1396,595.7 L1420,596.5 L1444,596.8 L1460,910 L-20,910 Z" fill="url(#lsHill2)"/>
        <path d="M0,588.7 a9.4,11.7 0 0 1 18.7,0 Z M14,593.3 a13.8,17.2 0 0 1 27.5,0 Z M34.7,592.4 a8.8,10.9 0 0 1 17.5,0 Z M47.8,597.1 a12.2,15.3 0 0 1 24.5,0 Z M66.2,597.3 a8.5,10.6 0 0 1 17,0 Z M78.9,600.5 a9.5,11.9 0 0 1 19,0 Z M93.2,606.7 a14,17.5 0 0 1 28,0 Z M114.2,606.8 a9.3,11.6 0 0 1 18.5,0 Z M128.1,611.1 a11.9,14.8 0 0 1 23.7,0 Z M145.8,612.8 a10.8,13.4 0 0 1 21.5,0 Z M162,614.7 a10.7,13.4 0 0 1 21.4,0 Z M178,616 a11,13.7 0 0 1 21.9,0 Z M194.5,615.5 a9.2,11.4 0 0 1 18.3,0 Z M208.2,618 a13,16.2 0 0 1 26,0 Z M227.7,614.8 a8.5,10.7 0 0 1 17.1,0 Z M240.5,614.6 a9.4,11.8 0 0 1 18.8,0 Z M254.6,612.9 a8.1,10.1 0 0 1 16.2,0 Z M266.8,612.6 a9.6,12 0 0 1 19.2,0 Z M281.2,611.6 a10.4,13.1 0 0 1 20.9,0 Z M296.9,611.5 a13.4,16.8 0 0 1 26.8,0 Z M317,608.1 a10.3,12.8 0 0 1 20.5,0 Z M332.4,605.9 a8.7,10.9 0 0 1 17.4,0 Z M345.4,605.6 a9.6,11.9 0 0 1 19.1,0 Z M359.7,607.3 a13.9,17.4 0 0 1 27.9,0 Z M380.7,603.4 a8.4,10.5 0 0 1 16.8,0 Z M393.2,605.3 a11.7,14.7 0 0 1 23.4,0 Z M410.8,604.4 a10.3,12.8 0 0 1 20.5,0 Z M426.2,605.7 a12,15 0 0 1 23.9,0 Z M444.2,604.8 a10,12.5 0 0 1 20.1,0 Z M459.2,606.4 a12.1,15.2 0 0 1 24.3,0 Z M477.4,605.9 a11,13.7 0 0 1 22,0 Z M493.9,606.5 a11.9,14.9 0 0 1 23.8,0 Z M511.8,607.2 a13.4,16.8 0 0 1 26.8,0 Z M531.9,605.7 a11.5,14.4 0 0 1 23,0 Z M549.1,603.6 a8.9,11.1 0 0 1 17.7,0 Z M562.4,602.8 a8.4,10.5 0 0 1 16.8,0 Z M575,605.2 a13.7,17.1 0 0 1 27.4,0 Z M595.5,602.8 a10.9,13.7 0 0 1 21.9,0 Z M611.9,601.1 a9.2,11.5 0 0 1 18.3,0 Z M625.6,603.2 a13.7,17.1 0 0 1 27.4,0 Z M646.1,601.4 a11.5,14.3 0 0 1 22.9,0 Z M663.3,601.7 a12.4,15.5 0 0 1 24.7,0 Z M681.9,602.1 a13.3,16.6 0 0 1 26.6,0 Z M701.8,599.9 a9.7,12.1 0 0 1 19.4,0 Z M716.4,600 a10.1,12.7 0 0 1 20.3,0 Z M731.6,601.7 a13.3,16.6 0 0 1 26.5,0 Z M751.5,598.5 a8.8,11 0 0 1 17.6,0 Z M764.7,600 a12.6,15.7 0 0 1 25.2,0 Z M783.6,596.7 a8.6,10.7 0 0 1 17.2,0 Z M796.5,597.3 a12.1,15.2 0 0 1 24.3,0 Z M814.7,595.3 a12.2,15.3 0 0 1 24.4,0 Z M833,593.6 a13.7,17.1 0 0 1 27.4,0 Z M853.6,590.2 a13.1,16.3 0 0 1 26.1,0 Z M873.2,586.2 a11,13.8 0 0 1 22,0 Z M889.7,582.8 a9.2,11.5 0 0 1 18.4,0 Z M903.5,580.6 a8.9,11.1 0 0 1 17.8,0 Z M916.8,580.1 a11.2,14 0 0 1 22.3,0 Z M933.6,578.3 a11.1,13.8 0 0 1 22.1,0 Z M950.2,575.8 a8.4,10.5 0 0 1 16.9,0 Z M962.8,578.3 a13.4,16.8 0 0 1 26.8,0 Z M982.9,577 a11,13.8 0 0 1 22.1,0 Z M999.5,578.5 a12.2,15.3 0 0 1 24.4,0 Z M1017.8,578.2 a9.3,11.6 0 0 1 18.6,0 Z M1031.8,579.8 a9.5,11.8 0 0 1 18.9,0 Z M1046,580.6 a8.1,10.1 0 0 1 16.1,0 Z M1058.1,583.8 a10.1,12.6 0 0 1 20.1,0 Z M1073.2,585.7 a9.6,12 0 0 1 19.2,0 Z M1087.6,588.5 a10.5,13.2 0 0 1 21.1,0 Z M1103.4,590.6 a10.3,12.8 0 0 1 20.5,0 Z M1118.8,594.6 a13,16.3 0 0 1 26,0 Z M1138.3,596.8 a13.3,16.7 0 0 1 26.7,0 Z M1158.3,595.5 a9.1,11.3 0 0 1 18.1,0 Z M1171.9,597.2 a10.4,13 0 0 1 20.8,0 Z M1187.5,597 a9,11.2 0 0 1 18,0 Z M1201,599.3 a12,15 0 0 1 24,0 Z M1218.9,600.8 a13.8,17.3 0 0 1 27.7,0 Z M1239.7,598.2 a9.2,11.5 0 0 1 18.4,0 Z M1253.5,600.5 a12.6,15.7 0 0 1 25.2,0 Z M1272.4,599.1 a9.8,12.3 0 0 1 19.6,0 Z M1287.1,598.3 a8.1,10.1 0 0 1 16.2,0 Z M1299.2,601.5 a12.6,15.7 0 0 1 25.2,0 Z M1318.1,600.6 a10.1,12.6 0 0 1 20.1,0 Z M1333.2,600.6 a9,11.3 0 0 1 18,0 Z M1346.7,602.3 a10.6,13.3 0 0 1 21.2,0 Z M1362.6,602.3 a9.4,11.7 0 0 1 18.8,0 Z M1376.7,603.6 a10.5,13.1 0 0 1 20.9,0 Z M1392.4,604.3 a10.7,13.3 0 0 1 21.4,0 Z M1408.4,604.7 a10.5,13.1 0 0 1 21,0 Z M1424.2,605.6 a11.5,14.4 0 0 1 23.1,0 Z " fill="#3f6b5b"/>
        <rect x="0" y="520" width="1440" height="200" fill="url(#lsHaze)" opacity="0.4"/>
        <rect x="0" y="716" width="1440" height="184" fill="url(#lsApron)"/>
        <rect x="0" y="772" width="1440" height="1.2" fill="#6c7788" fillOpacity="0.28"/>
        <rect x="0" y="836" width="1440" height="1.2" fill="#6c7788" fillOpacity="0.28"/>
        <rect x="40" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="220" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="400" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="580" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="760" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="940" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="1120" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <rect x="1300" y="716" width="1.2" height="184" fill="#6c7788" fillOpacity="0.12"/>
        <g>
        <rect x="22" y="470" width="62" height="250" fill="url(#lsTank)"/>
        <ellipse cx="53" cy="470" rx="31" ry="9" fill="#e7ecf3"/>
        <ellipse cx="53" cy="470" rx="31" ry="9" fill="none" stroke="#8b98aa" strokeWidth="1.2"/>
        <rect x="22" y="470" width="62" height="250" fill="url(#lsRib)" opacity="0.5"/>
        <rect x="22" y="520" width="62" height="2" fill="#6c7a8e" fillOpacity="0.35"/>
        <rect x="22" y="580" width="62" height="2" fill="#6c7a8e" fillOpacity="0.35"/>
        <rect x="22" y="640" width="62" height="2" fill="#6c7a8e" fillOpacity="0.35"/>
        <rect x="72" y="476" width="3" height="244" fill="#59667a" fillOpacity="0.6"/>
        </g>
        <g>
        <rect x="868" y="470" width="150" height="250" fill="url(#lsWall)"/>
        <rect x="860" y="458" width="166" height="16" fill="url(#lsRoof)"/>
        <rect x="860" y="458" width="166" height="2.5" fill="#ffffff" fillOpacity="0.7"/>
        <rect x="882" y="496" width="122" height="44" rx="3" fill="url(#lsGlass)"/>
        <path d="M888 536 L918 500 L936 500 L906 536 Z" fill="#ffffff" fillOpacity="0.22"/>
        <path d="M930 536 L952 500 L960 500 L938 536 Z" fill="#ffffff" fillOpacity="0.14"/>
        <rect x="882" y="539" width="122" height="3" fill="#b5c0cd"/>
        <rect x="942" y="496" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="912" y="496" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="882" y="560" width="122" height="44" rx="3" fill="url(#lsGlass)"/>
        <path d="M888 600 L918 564 L936 564 L906 600 Z" fill="#ffffff" fillOpacity="0.22"/>
        <path d="M930 600 L952 564 L960 564 L938 600 Z" fill="#ffffff" fillOpacity="0.14"/>
        <rect x="882" y="603" width="122" height="3" fill="#b5c0cd"/>
        <rect x="942" y="560" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="912" y="560" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="882" y="624" width="122" height="44" rx="3" fill="url(#lsGlass)"/>
        <path d="M888 664 L918 628 L936 628 L906 664 Z" fill="#ffffff" fillOpacity="0.22"/>
        <path d="M930 664 L952 628 L960 628 L938 664 Z" fill="#ffffff" fillOpacity="0.14"/>
        <rect x="882" y="667" width="122" height="3" fill="#b5c0cd"/>
        <rect x="942" y="624" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="912" y="624" width="2" height="44" fill="#d9e0e8" fillOpacity="0.85"/>
        <rect x="868" y="470" width="8" height="250" fill="#ffffff" fillOpacity="0.35"/>
        <rect x="1008" y="470" width="10" height="250" fill="#0b1730" fillOpacity="0.12"/>
        </g>
        <g>
        <rect x="96" y="522" width="768" height="198" fill="url(#lsWall)"/>
        <rect x="96" y="522" width="768" height="198" fill="url(#lsCorr)"/>
        <rect x="86" y="500" width="788" height="26" fill="url(#lsRoof)"/>
        <rect x="86" y="500" width="788" height="3" fill="#ffffff" fillOpacity="0.75"/>
        <rect x="86" y="524" width="788" height="5" fill="#0b1730" fillOpacity="0.2"/>
        <rect x="96" y="560" width="768" height="9" fill="var(--primary, #2563eb)"/>
        <rect x="96" y="560" width="768" height="2" fill="#ffffff" fillOpacity="0.35"/>
        <rect x="124" y="534" width="262" height="46" rx="6" fill="#0f1f3d"/>
        <rect x="124" y="534" width="262" height="2" rx="1" fill="#ffffff" fillOpacity="0.3"/>
        <image href="/icons/favicon.png" x="348" y="541" width="32" height="32"/>
        <rect x="348" y="541" width="32" height="32" rx="7" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2"/>
        <text x="232" y="565" textAnchor="middle" fontSize="23" fontWeight="800" fill="#ffffff" fontFamily="Vazirmatn, Tahoma, sans-serif">حمل و نقل کامران</text>
        <rect x="121" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="121" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="126" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="126" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="162" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="117" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="212" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="121" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="154" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="154" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="211" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="211" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="216" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="216" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="252" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="207" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="302" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="211" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="244" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="244" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="301" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="301" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="306" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="306" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="342" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="297" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="392" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="301" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="334" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="334" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="391" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="391" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="396" y="612" width="82" height="108" fill="url(#lsInterior)"/>
        <rect x="406" y="676" width="30" height="44" fill="#c8a06c"/>
        <rect x="406" y="676" width="30" height="5" fill="#e7c897"/>
        <rect x="440" y="688" width="24" height="32" fill="#b98a5a"/>
        <rect x="396" y="612" width="82" height="50" fill="url(#lsDoor)"/>
        <rect x="396" y="612" width="82" height="50" fill="url(#lsSlats)"/>
        <rect x="396" y="660" width="82" height="4" fill="#79869a"/>
        <rect x="387" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="482" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="391" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="424" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="424" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="481" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="481" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="486" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="486" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="522" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="477" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="572" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="481" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="514" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="514" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="571" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="571" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="576" y="612" width="82" height="108" fill="url(#lsInterior)"/>
        <rect x="576" y="612" width="82" height="16" fill="url(#lsDoor)"/>
        <rect x="576" y="612" width="82" height="16" fill="url(#lsSlats)"/>
        <rect x="592" y="640" width="50" height="80" fill="#fff6d8" fillOpacity="0.07"/>
        <rect x="567" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="662" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="571" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="604" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="604" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="661" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="661" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="666" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="666" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="702" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="657" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="752" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="661" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="694" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="694" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="751" y="608" width="92" height="112" fill="#8d99aa"/>
        <rect x="751" y="608" width="92" height="4" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="756" y="612" width="82" height="108" fill="url(#lsDoor)"/>
        <rect x="756" y="612" width="82" height="108" fill="url(#lsSlats)"/>
        <rect x="792" y="700" width="10" height="4" rx="1" fill="#59667a"/>
        <rect x="747" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="842" y="612" width="5" height="108" fill="#1b2230"/>
        <rect x="751" y="712" width="92" height="8" fill="url(#lsHazard)"/>
        <rect x="784" y="596" width="26" height="6" rx="2" fill="#f7f9fc"/>
        <rect x="784" y="602" width="26" height="14" fill="#fff6d8" fillOpacity="0.18" filter="url(#lsBlurS)"/>
        <rect x="96" y="720" width="768" height="16" fill="url(#lsShade)" transform="translate(0 0)"/>
        <rect x="96" y="522" width="9" height="198" fill="#ffffff" fillOpacity="0.4"/>
        <rect x="855" y="522" width="9" height="198" fill="#0b1730" fillOpacity="0.12"/>
        </g>
        <g>
        <rect x="690" y="715" width="86" height="12" fill="url(#lsShade)"/>
        <rect x="692" y="708" width="82" height="10" fill="#b58a52"/><rect x="692" y="708" width="82" height="2" fill="#e0b97c"/>
        <rect x="696" y="716" width="18" height="4" fill="#8a6234"/>
        <rect x="724" y="716" width="18" height="4" fill="#8a6234"/>
        <rect x="752" y="716" width="18" height="4" fill="#8a6234"/>
        <rect x="694" y="672" width="38" height="36" fill="#c99a62"/><rect x="694" y="672" width="38" height="3" fill="#ffffff" fillOpacity="0.35"/><rect x="727" y="672" width="5" height="36" fill="#3b2410" fillOpacity="0.2"/>
        <rect x="734" y="676" width="38" height="32" fill="#c99a62"/><rect x="734" y="676" width="38" height="3" fill="#ffffff" fillOpacity="0.35"/><rect x="767" y="676" width="5" height="32" fill="#3b2410" fillOpacity="0.2"/>
        <rect x="702" y="640" width="52" height="32" fill="#c99a62"/><rect x="702" y="640" width="52" height="3" fill="#ffffff" fillOpacity="0.35"/><rect x="749" y="640" width="5" height="32" fill="#3b2410" fillOpacity="0.2"/>
        <rect x="692" y="638" width="84" height="72" rx="4" fill="#ffffff" fillOpacity="0.2"/>
        <path d="M698 700 L742 642 M720 708 L770 650" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2"/>
        </g>
        <g><path d="M839 724 L853 724 L849 700 L843 700 Z" fill="#f26a1b"/><rect x="840.8" y="710" width="10.4" height="4.4" fill="#ffffff"/><rect x="837" y="723" width="18" height="4" rx="1.5" fill="#1b2230"/></g>
        <g><path d="M865 724 L879 724 L875 700 L869 700 Z" fill="#f26a1b"/><rect x="866.8" y="710" width="10.4" height="4.4" fill="#ffffff"/><rect x="863" y="723" width="18" height="4" rx="1.5" fill="#1b2230"/></g>
        <rect x="1030" y="722" width="400" height="14" fill="url(#lsShade)"/>
        <g><rect x="1034" y="688" width="130" height="31" fill="#c1443f"/><rect x="1034" y="688" width="130" height="31" fill="url(#lsRib)"/><rect x="1034" y="688" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1034" y="715" width="130" height="4" fill="#a7332f"/><rect x="1034" y="688" width="6" height="31" fill="#a7332f"/><rect x="1158" y="688" width="6" height="31" fill="#a7332f"/><rect x="1057.4" y="697.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1057.4" y="705.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1168" y="688" width="130" height="31" fill="#cf5a2e"/><rect x="1168" y="688" width="130" height="31" fill="url(#lsRib)"/><rect x="1168" y="688" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1168" y="715" width="130" height="4" fill="#b2471f"/><rect x="1168" y="688" width="6" height="31" fill="#b2471f"/><rect x="1292" y="688" width="6" height="31" fill="#b2471f"/><rect x="1191.4" y="697.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1191.4" y="705.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1302" y="688" width="130" height="31" fill="#6d7a8c"/><rect x="1302" y="688" width="130" height="31" fill="url(#lsRib)"/><rect x="1302" y="688" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1302" y="715" width="130" height="4" fill="#566274"/><rect x="1302" y="688" width="6" height="31" fill="#566274"/><rect x="1426" y="688" width="6" height="31" fill="#566274"/><rect x="1325.4" y="697.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1325.4" y="705.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1040" y="656" width="130" height="31" fill="#6d7a8c"/><rect x="1040" y="656" width="130" height="31" fill="url(#lsRib)"/><rect x="1040" y="656" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1040" y="683" width="130" height="4" fill="#566274"/><rect x="1040" y="656" width="6" height="31" fill="#566274"/><rect x="1164" y="656" width="6" height="31" fill="#566274"/><rect x="1063.4" y="665.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1063.4" y="673.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1174" y="656" width="130" height="31" fill="#3a8f7b"/><rect x="1174" y="656" width="130" height="31" fill="url(#lsRib)"/><rect x="1174" y="656" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1174" y="683" width="130" height="4" fill="#2c7664"/><rect x="1174" y="656" width="6" height="31" fill="#2c7664"/><rect x="1298" y="656" width="6" height="31" fill="#2c7664"/><rect x="1197.4" y="665.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1197.4" y="673.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1308" y="656" width="130" height="31" fill="#e0a63a"/><rect x="1308" y="656" width="130" height="31" fill="url(#lsRib)"/><rect x="1308" y="656" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1308" y="683" width="130" height="4" fill="#c68e24"/><rect x="1308" y="656" width="6" height="31" fill="#c68e24"/><rect x="1432" y="656" width="6" height="31" fill="#c68e24"/><rect x="1331.4" y="665.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1331.4" y="673.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1034" y="624" width="130" height="31" fill="#e0a63a"/><rect x="1034" y="624" width="130" height="31" fill="url(#lsRib)"/><rect x="1034" y="624" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1034" y="651" width="130" height="4" fill="#c68e24"/><rect x="1034" y="624" width="6" height="31" fill="#c68e24"/><rect x="1158" y="624" width="6" height="31" fill="#c68e24"/><rect x="1057.4" y="633.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1057.4" y="641.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1168" y="624" width="130" height="31" fill="#2f6fae"/><rect x="1168" y="624" width="130" height="31" fill="url(#lsRib)"/><rect x="1168" y="624" width="130" height="3" fill="#ffffff" fillOpacity="0.28"/><rect x="1168" y="651" width="130" height="4" fill="#245a90"/><rect x="1168" y="624" width="6" height="31" fill="#245a90"/><rect x="1292" y="624" width="6" height="31" fill="#245a90"/><rect x="1191.4" y="633.3" width="39.0" height="4" rx="1" fill="#ffffff" fillOpacity="0.85"/><rect x="1191.4" y="641.3" width="23.4" height="3" rx="1" fill="#ffffff" fillOpacity="0.6"/></g>
        <g><rect x="1028" y="520" width="5" height="200" fill="#4b5668"/><rect x="1012" y="516" width="40" height="6" rx="3" fill="#39445a"/><rect x="1008" y="520" width="20" height="5" rx="2" fill="#f4f7fb"/><rect x="1008" y="525" width="20" height="14" fill="#fff6d8" fillOpacity="0.2" filter="url(#lsBlurS)"/></g>
        <path d="M1092,722 C1079,662 1082.9,609.5 1092,572 C1101.1,609.5 1105,662 1092,722 Z M1112,722 C1101,674 1104.3,632 1112,602 C1119.7,632 1123,674 1112,722 Z M1408,722 C1394,654 1398.2,594.5 1408,552 C1417.8,594.5 1422,654 1408,722 Z M1428,722 C1416,670 1419.6,624.5 1428,592 C1436.4,624.5 1440,670 1428,722 Z M880,722 C870,678 873,639.5 880,612 C887,639.5 890,678 880,722 Z " fill="#2f5a49"/>
        <path d="M1092,722 C1079,662 1082.9,609.5 1092,572 C1101.1,609.5 1105,662 1092,722 Z M1112,722 C1101,674 1104.3,632 1112,602 C1119.7,632 1123,674 1112,722 Z M1408,722 C1394,654 1398.2,594.5 1408,552 C1417.8,594.5 1422,654 1408,722 Z M1428,722 C1416,670 1419.6,624.5 1428,592 C1436.4,624.5 1440,670 1428,722 Z M880,722 C870,678 873,639.5 880,612 C887,639.5 890,678 880,722 Z " fill="url(#lsShade)" opacity="0.5"/>
        </svg>
    );
}

/* Classic blue Nissan pickup with three boxes. Rolls in on first paint, noses
   down as it brakes, then idles (exhaust only). */
export function LoginTruck() {
    if (NISSAN_PHOTO) {
        return (
            <div className="login-truck login-truck--photo" aria-hidden="true">
                <img className="login-truck-img" src={NISSAN_PHOTO} alt="" />
            </div>
        );
    }

    return (
        <div className="login-truck" aria-hidden="true">
            <svg className="login-truck-svg" viewBox="0 0 540 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
            <linearGradient id="nzBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#58a2fa"/><stop offset="0.3" stopColor="#2a82e8"/><stop offset="0.7" stopColor="#1c66cc"/><stop offset="1" stopColor="#114391"/></linearGradient>
            <linearGradient id="nzRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b7dbff"/><stop offset="0.5" stopColor="#63aefc"/><stop offset="1" stopColor="#2a82e8"/></linearGradient>
            <linearGradient id="nzGrime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#241a10" stopOpacity="0"/><stop offset="1" stopColor="#241a10" stopOpacity="0.36"/></linearGradient>
            <linearGradient id="nzSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0"/><stop offset="0.5" stopColor="#ffffff" stopOpacity="0.22"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
            <linearGradient id="nzSilver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9fabbb"/><stop offset="0.5" stopColor="#f4f7fa"/><stop offset="1" stopColor="#aab5c4"/></linearGradient>
            <linearGradient id="nzGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfe2f6"/><stop offset="0.55" stopColor="#6597bb"/><stop offset="1" stopColor="#2b4a68"/></linearGradient>
            <radialGradient id="nzRim" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#4a5361"/><stop offset="0.7" stopColor="#232a35"/><stop offset="1" stopColor="#0f141b"/></radialGradient>
            <radialGradient id="nzHub" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#f4f6f9"/><stop offset="1" stopColor="#8590a0"/></radialGradient>
            <linearGradient id="nzChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="0.45" stopColor="#9aa6b4"/><stop offset="0.6" stopColor="#f1f4f8"/><stop offset="1" stopColor="#7f8b9a"/></linearGradient>
            <linearGradient id="nzLamp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#ffe9a6"/></linearGradient>
            <radialGradient id="tkTire" cx="50%" cy="50%" r="50%"><stop offset="0.7" stopColor="#1a212d"/><stop offset="1" stopColor="#07090e"/></radialGradient>
            <linearGradient id="tkSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1f4f8"/><stop offset="0.45" stopColor="#9aa5b3"/><stop offset="1" stopColor="#d4dae2"/></linearGradient>
            <linearGradient id="tkCard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7aa78"/><stop offset="1" stopColor="#b78850"/></linearGradient>
            <linearGradient id="tkCard2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cc9c68"/><stop offset="1" stopColor="#a9793f"/></linearGradient>
            <filter id="tkBlur" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="4.5"/></filter>
            <filter id="tkBlurS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6"/></filter>
            </defs>
            <ellipse cx="262" cy="242" rx="262" ry="9" fill="#050a14" fillOpacity="0.5" filter="url(#tkBlur)"/>
            <rect x="36" y="189" width="452" height="16" fill="#0e131b"/>
            <rect x="34" y="202" width="104" height="4" rx="2" fill="url(#nzSilver)"/><rect x="26" y="200" width="14" height="8" rx="2.5" fill="#dfe5ec"/><ellipse cx="27" cy="204" rx="2.2" ry="3.6" fill="#11161d"/>
            <rect x="282" y="197" width="66" height="16" rx="4" fill="#1d2532"/><rect x="282" y="197" width="66" height="2" fill="#ffffff" fillOpacity="0.14"/>
            <g>
            <g><rect x="150" y="82" width="66" height="58" fill="url(#tkCard)"/><rect x="150" y="82" width="66" height="3.5" fill="#ffffff" fillOpacity="0.38"/><rect x="211" y="82" width="5" height="58" fill="#3b2410" fillOpacity="0.22"/><rect x="150" y="82" width="2" height="58" fill="#ffffff" fillOpacity="0.18"/><rect x="178.5" y="82" width="9" height="58" fill="#e6cfa4" fillOpacity="0.7"/><rect x="156" y="111.0" width="16" height="11" rx="1.2" fill="#f7f4ec"/><rect x="158" y="114.0" width="10" height="1.4" fill="#59534a"/><rect x="158" y="117.2" width="7" height="1.4" fill="#59534a"/><rect x="150" y="137" width="66" height="3" fill="#000000" fillOpacity="0.18"/></g>
            <g><rect x="220" y="96" width="46" height="44" fill="url(#tkCard2)"/><rect x="220" y="96" width="46" height="3.5" fill="#ffffff" fillOpacity="0.38"/><rect x="261" y="96" width="5" height="44" fill="#3b2410" fillOpacity="0.22"/><rect x="220" y="96" width="2" height="44" fill="#ffffff" fillOpacity="0.18"/><rect x="238.5" y="96" width="9" height="44" fill="#e6cfa4" fillOpacity="0.7"/><rect x="226" y="118.0" width="12.88" height="11" rx="1.2" fill="#f7f4ec"/><rect x="228" y="121.0" width="6.880000000000001" height="1.4" fill="#59534a"/><rect x="228" y="124.2" width="3.880000000000001" height="1.4" fill="#59534a"/><rect x="220" y="137" width="46" height="3" fill="#000000" fillOpacity="0.18"/></g>
            <g><rect x="160" y="48" width="46" height="36" fill="url(#tkCard2)"/><rect x="160" y="48" width="46" height="3.5" fill="#ffffff" fillOpacity="0.38"/><rect x="201" y="48" width="5" height="36" fill="#3b2410" fillOpacity="0.22"/><rect x="160" y="48" width="2" height="36" fill="#ffffff" fillOpacity="0.18"/><rect x="178.5" y="48" width="9" height="36" fill="#e6cfa4" fillOpacity="0.7"/><rect x="166" y="66.0" width="12.88" height="11" rx="1.2" fill="#f7f4ec"/><rect x="168" y="69.0" width="6.880000000000001" height="1.4" fill="#59534a"/><rect x="168" y="72.2" width="3.880000000000001" height="1.4" fill="#59534a"/><rect x="160" y="81" width="46" height="3" fill="#000000" fillOpacity="0.18"/></g>
            <rect x="180" y="48" width="6.5" height="92" fill="#e4572e"/><rect x="180" y="48" width="1.8" height="92" fill="#ffffff" fillOpacity="0.3"/>
            <rect x="178.5" y="90" width="9.5" height="8" rx="1.5" fill="url(#tkSteel)"/>
            </g>
            <g className="lt-body">
            <path d="M30 194 L30 132 L270 132 L270 100 Q270 84 285 84 L334 84 Q343 84 347 91 L378 133 L474 141 Q487 143 488 156 L490 178 L490 194 Z" fill="url(#nzBody)"/>
            <path d="M270 100 Q270 84 285 84 L334 84 Q343 84 347 91 L356 106 L270 106 Z" fill="url(#nzRoof)"/>
            <path d="M272 90 Q276 84 286 84 L334 84 Q342 84 346 90" fill="none" stroke="#e3f1ff" strokeWidth="2"/>
            <rect x="30" y="128" width="240" height="6" rx="1.5" fill="#4a97f0"/><rect x="30" y="128" width="240" height="1.8" fill="#d2e8ff"/><rect x="30" y="132" width="240" height="2" fill="#0a2c6b" fillOpacity="0.5"/>
            <rect x="30" y="152" width="240" height="2.2" fill="#0a2c6b" fillOpacity="0.5"/><rect x="30" y="154.2" width="240" height="1.2" fill="#ffffff" fillOpacity="0.3"/>
            <rect x="30" y="134" width="3" height="60" fill="#0a2c6b" fillOpacity="0.55"/>
            <rect x="262" y="132" width="8" height="62" fill="#0a2c6b" fillOpacity="0.4"/>
            <rect x="30" y="154" width="460" height="40" fill="url(#nzGrime)"/>
            <path d="M62 133 L112 133 L84 193 L40 193 Z" fill="url(#nzSheen)"/><path d="M208 133 L232 133 L208 193 L184 193 Z" fill="url(#nzSheen)" opacity="0.6"/>
            <path d="M284 112 L312 112 L296 190 L282 190 Z" fill="url(#nzSheen)"/><path d="M388 146 L436 148 L424 176 L376 174 Z" fill="url(#nzSheen)" opacity="0.7"/>
            <path d="M34 158 L262 150 L262 154 L38 164 Z" fill="url(#nzSilver)" opacity="0.95"/>
            <path d="M34 176 L250 176 L250 179.5 L34 180 Z" fill="url(#nzSilver)" opacity="0.85"/>
            <path d="M284 150 L378 146 L480 150 L470 153 L392 152 L330 164 L290 168 Z" fill="url(#nzSilver)" opacity="0.95"/>
            <path d="M290 172 L372 168 L372 171 L292 176 Z" fill="url(#nzSilver)" opacity="0.7"/>
            <rect x="28" y="146" width="8" height="26" rx="2.5" fill="#d1332b"/><rect x="28" y="146" width="2.4" height="26" fill="#ffffff" fillOpacity="0.45"/><rect x="29" y="173" width="6" height="5" rx="1" fill="#ff9a1f"/>
            <rect x="18" y="178" width="20" height="17" rx="3" fill="url(#nzChrome)"/>
            <path d="M281 96 L333 96 Q338 96 341 100 L357 130 L281 130 Z" fill="#0f1621"/>
            <path d="M285 100 L331 100 Q334 100 336 103 L350 126 L285 126 Z" fill="url(#nzGlass)"/>
            <path d="M290 102 L310 102 L296 126 L290 126 Z" fill="#ffffff" fillOpacity="0.24"/>
            <path d="M270 100 L281 96 L281 130 L270 132 Z" fill="#0a2c6b" fillOpacity="0.55"/>
            <path d="M281 96 L281 192" stroke="#0a2c6b" strokeWidth="1.5"/><path d="M281 96 L281 192" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.7" transform="translate(1.3 0)"/>
            <path d="M374 134 L374 192" stroke="#0a2c6b" strokeWidth="1.5"/>
            <rect x="286" y="141" width="14" height="4.2" rx="2" fill="url(#nzChrome)"/>
            <path d="M356 120 L362 117" stroke="#10151e" strokeWidth="2.6" strokeLinecap="round"/><rect x="359" y="105" width="9" height="20" rx="3.5" fill="#141b27"/><rect x="360.6" y="107" width="2.6" height="15" rx="1.3" fill="#ffffff" fillOpacity="0.22"/>
            <path d="M378 136 L472 144" stroke="#d2e8ff" strokeWidth="1.6" strokeOpacity="0.8"/>
            <rect x="474" y="144" width="14" height="16" rx="4" fill="#d9dee5"/><rect x="476" y="146" width="10" height="12" rx="3.5" fill="url(#nzLamp)"/>
            <rect x="470" y="142" width="20" height="20" fill="#fff6c9" fillOpacity="0.4" filter="url(#tkBlurS)"/>
            <rect x="478" y="164" width="9" height="6" rx="2" fill="#ff9a1f"/>
            <path d="M479 172 L490 172 L490 190 L476 190 Z" fill="#151b26"/><rect x="479" y="178" width="11" height="2.4" fill="url(#nzChrome)"/>
            <rect x="472" y="176" width="26" height="18" rx="5" fill="url(#nzChrome)"/><rect x="474" y="178" width="20" height="2.2" rx="1.1" fill="#ffffff" fillOpacity="0.9"/>
            <path d="M496 160 Q510 162 510 178 L510 192 Q510 198 502 198 L488 198" fill="none" stroke="#6c7889" strokeWidth="5" strokeLinecap="round"/>
            <path d="M496 160 Q510 162 510 178 L510 192 Q510 198 502 198 L488 198" fill="none" stroke="url(#nzChrome)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M111 195 L111 202 A45 45 0 0 1 201 202 L201 195 Z" fill="#0b1017"/><path d="M107 195 L107 204 A49 49 0 0 1 205 204 L205 195" fill="none" stroke="#0e141c" strokeWidth="5.5"/><path d="M104.5 196 A51.5 51.5 0 0 1 207.5 196" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2"/>
            <path d="M379 195 L379 202 A45 45 0 0 1 469 202 L469 195 Z" fill="#0b1017"/><path d="M375 195 L375 204 A49 49 0 0 1 473 204 L473 195" fill="none" stroke="#0e141c" strokeWidth="5.5"/><path d="M372.5 196 A51.5 51.5 0 0 1 475.5 196" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2"/>
            <rect x="102" y="192" width="5" height="32" rx="1.5" fill="#0f141b"/>
            <rect x="473" y="192" width="4" height="28" rx="1.5" fill="#0f141b"/>
            <rect x="30" y="191" width="460" height="3" fill="#0b1018" fillOpacity="0.6"/>
            </g>
            <g transform="translate(156 202)"><g className="lt-wheel"><circle r="38" fill="url(#tkTire)"/><circle r="35.7" fill="none" stroke="#2b3441" strokeWidth="3" strokeDasharray="5 3.4"/><circle r="29.5" fill="#10151e"/><circle r="28" fill="none" stroke="#262f3d" strokeWidth="1"/><circle r="20.5" fill="url(#nzRim)"/><circle r="20.5" fill="none" stroke="#0a0e14" strokeWidth="1.2"/><ellipse cx="0.0" cy="-12.6" rx="2.6" ry="4" transform="rotate(0 0.0 -12.6)" fill="#070a0f"/><ellipse cx="12.0" cy="-3.9" rx="2.6" ry="4" transform="rotate(72 12.0 -3.9)" fill="#070a0f"/><ellipse cx="7.4" cy="10.2" rx="2.6" ry="4" transform="rotate(144 7.4 10.2)" fill="#070a0f"/><ellipse cx="-7.4" cy="10.2" rx="2.6" ry="4" transform="rotate(216 -7.4 10.2)" fill="#070a0f"/><ellipse cx="-12.0" cy="-3.9" rx="2.6" ry="4" transform="rotate(288 -12.0 -3.9)" fill="#070a0f"/><circle r="8.2" fill="url(#nzHub)"/><circle cx="3.1" cy="-4.2" r="1.3" fill="#58626f"/><circle cx="4.9" cy="1.6" r="1.3" fill="#58626f"/><circle cx="0.0" cy="5.2" r="1.3" fill="#58626f"/><circle cx="-4.9" cy="1.6" r="1.3" fill="#58626f"/><circle cx="-3.1" cy="-4.2" r="1.3" fill="#58626f"/><circle r="2.5" fill="#f1f4f8"/></g><path d="M-33.5 -5 A33.5 33.5 0 0 1 -5 -33.5" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2.6" strokeLinecap="round"/></g>
            <g transform="translate(424 202)"><g className="lt-wheel"><circle r="38" fill="url(#tkTire)"/><circle r="35.7" fill="none" stroke="#2b3441" strokeWidth="3" strokeDasharray="5 3.4"/><circle r="29.5" fill="#10151e"/><circle r="28" fill="none" stroke="#262f3d" strokeWidth="1"/><circle r="20.5" fill="url(#nzRim)"/><circle r="20.5" fill="none" stroke="#0a0e14" strokeWidth="1.2"/><ellipse cx="0.0" cy="-12.6" rx="2.6" ry="4" transform="rotate(0 0.0 -12.6)" fill="#070a0f"/><ellipse cx="12.0" cy="-3.9" rx="2.6" ry="4" transform="rotate(72 12.0 -3.9)" fill="#070a0f"/><ellipse cx="7.4" cy="10.2" rx="2.6" ry="4" transform="rotate(144 7.4 10.2)" fill="#070a0f"/><ellipse cx="-7.4" cy="10.2" rx="2.6" ry="4" transform="rotate(216 -7.4 10.2)" fill="#070a0f"/><ellipse cx="-12.0" cy="-3.9" rx="2.6" ry="4" transform="rotate(288 -12.0 -3.9)" fill="#070a0f"/><circle r="8.2" fill="url(#nzHub)"/><circle cx="3.1" cy="-4.2" r="1.3" fill="#58626f"/><circle cx="4.9" cy="1.6" r="1.3" fill="#58626f"/><circle cx="0.0" cy="5.2" r="1.3" fill="#58626f"/><circle cx="-4.9" cy="1.6" r="1.3" fill="#58626f"/><circle cx="-3.1" cy="-4.2" r="1.3" fill="#58626f"/><circle r="2.5" fill="#f1f4f8"/></g><path d="M-33.5 -5 A33.5 33.5 0 0 1 -5 -33.5" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2.6" strokeLinecap="round"/></g>
            <circle className="lt-puff lt-puff-0" cx="27" cy="204" r="6" fill="#e9eef4"/>
            <circle className="lt-puff lt-puff-1" cx="27" cy="204" r="6" fill="#e9eef4"/>
            <circle className="lt-puff lt-puff-2" cx="27" cy="204" r="6" fill="#e9eef4"/>
            </svg>
        </div>
    );
}
