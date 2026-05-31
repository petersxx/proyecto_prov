import { MESA_MAP } from '../data/mesas'
import './TableMap.css'

// ─── Table primitives (defined outside to avoid remounting) ────────────────

function TRect({ id, x, y, w, h, onSelect }) {
  const mesa = MESA_MAP[id]
  if (!mesa) return null
  const reservable = mesa.reservable !== false
  const cx = x + w / 2
  const cy = y + h / 2
  const smallLabel = id.length > 3

  return (
    <g
      className={`tm-table ${reservable ? 'tm-table--avail' : 'tm-table--nobook'}`}
      onClick={reservable ? () => onSelect(mesa) : undefined}
      role={reservable ? 'button' : undefined}
      aria-label={reservable ? `${mesa.nombre}, ${mesa.min}-${mesa.max} personas` : undefined}
    >
      <rect x={x} y={y} width={w} height={h} rx={4} />
      <text x={cx} y={cy - (reservable ? 6 : 0)} textAnchor="middle" dominantBaseline="middle"
        className={`tm-num ${smallLabel ? '' : 'tm-num--lg'}`}>
        {id}
      </text>
      {reservable && (
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" className="tm-cap">
          {mesa.min}–{mesa.max}p
        </text>
      )}
    </g>
  )
}

function TCircle({ id, cx, cy, r, onSelect }) {
  const mesa = MESA_MAP[id]
  if (!mesa) return null
  const reservable = mesa.reservable !== false
  const smallLabel = id.length > 3

  return (
    <g
      className={`tm-table ${reservable ? 'tm-table--avail' : 'tm-table--nobook'}`}
      onClick={reservable ? () => onSelect(mesa) : undefined}
      role={reservable ? 'button' : undefined}
      aria-label={reservable ? `${mesa.nombre}, ${mesa.min}-${mesa.max} personas` : undefined}
    >
      <circle cx={cx} cy={cy} r={r} />
      <text x={cx} y={cy - (reservable ? 6 : 0)} textAnchor="middle" dominantBaseline="middle"
        className={`tm-num ${smallLabel ? '' : 'tm-num--lg'}`}>
        {id}
      </text>
      {reservable && (
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" className="tm-cap">
          {mesa.min}–{mesa.max}p
        </text>
      )}
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

export default function TableMap({ onTableSelect }) {
  function sel(mesa) { onTableSelect(mesa) }

  return (
    <div className="tm-wrapper">
      <svg
        viewBox="0 0 590 920"
        className="tm-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Plano de mesas del restaurante"
      >
        {/* ── Outer boundary ─────────────────────────────────────── */}
        <rect x="2" y="2" width="586" height="916" rx="24"
          fill="#faf8f5" stroke="#d4c4a8" strokeWidth="2" />

        {/* ── BARRA (y 2–115) ────────────────────────────────────── */}
        <rect x="2" y="2" width="586" height="113" rx="24"
          fill="#f0ebe0" stroke="none" />
        <rect x="2" y="68" width="586" height="47" fill="#f0ebe0" />

        <text x="295" y="20" textAnchor="middle" className="tm-section">Barra</text>

        {/* Bar counter */}
        <rect x="82" y="30" width="378" height="47" rx="3"
          fill="#e8dcc8" stroke="#c4a878" strokeWidth="1.5" />
        <text x="205" y="57" textAnchor="middle" className="tm-bar-sec">B</text>
        <text x="350" y="57" textAnchor="middle" className="tm-bar-sec">A</text>

        {/* Stools top */}
        {[148, 193, 297, 342].map(sx => (
          <rect key={`st${sx}`} x={sx} y={18} width={13} height={11} rx={2}
            fill="white" stroke="#c4a878" strokeWidth={1} />
        ))}
        {/* Stools bottom */}
        {[148, 193, 297, 342].map(sx => (
          <rect key={`sb${sx}`} x={sx} y={79} width={13} height={11} rx={2}
            fill="white" stroke="#c4a878" strokeWidth={1} />
        ))}

        <TCircle id="16" cx={553} cy={72} r={27} onSelect={sel} />

        {/* ── SALÓN (y 115–502) ──────────────────────────────────── */}
        <text x="295" y="492" textAnchor="middle" className="tm-section">Salón</text>

        {/* Architectural column / pillar between bar and tables */}
        <rect x="237" y="130" width="18" height="145" rx="2"
          fill="#d4c4a8" stroke="#c4a878" strokeWidth="1" />

        {/* Tables */}
        <TRect id="15"  x={11}  y={130} w={72}  h={162} onSelect={sel} />
        <TRect id="9"   x={130} y={122} w={65}  h={62}  onSelect={sel} />
        <TRect id="10"  x={140} y={206} w={65}  h={58}  onSelect={sel} />
        <TRect id="11"  x={140} y={288} w={65}  h={58}  onSelect={sel} />
        <TCircle id="14" cx={62}  cy={432} r={46}  onSelect={sel} />
        <TCircle id="8"  cx={292} cy={186} r={52}  onSelect={sel} />
        <TRect id="7"   x={244} y={307} w={73}  h={73}  onSelect={sel} />
        <TCircle id="6"  cx={402} cy={308} r={49}  onSelect={sel} />
        <TRect id="2"   x={474} y={122} w={97}  h={100} onSelect={sel} />
        <TRect id="3"   x={474} y={266} w={94}  h={158} onSelect={sel} />
        <TRect id="12"  x={109} y={430} w={75}  h={58}  onSelect={sel} />
        <TRect id="5"   x={282} y={423} w={78}  h={68}  onSelect={sel} />
        <TRect id="4"   x={471} y={430} w={70}  h={56}  onSelect={sel} />

        {/* Wall Salón / Terraza with entrance */}
        <line x1="2"   y1="500" x2="202" y2="500" stroke="#c4a878" strokeWidth="3" />
        <line x1="388" y1="500" x2="588" y2="500" stroke="#c4a878" strokeWidth="3" />
        <path d="M202,500 Q295,462 388,500" fill="none"
          stroke="#c4a878" strokeWidth="2" strokeDasharray="6,3" />

        {/* ── TERRAZA (y 500–750) ─────────────────────────────────── */}
        <rect x="3" y="500" width="584" height="250" fill="#f0f4ee" />
        <text x="295" y="652" textAnchor="middle" className="tm-section">Terraza</text>

        {/* Left cluster */}
        <TRect id="21"  x={10}  y={510} w={58}  h={58}  onSelect={sel} />
        <TRect id="20B" x={78}  y={503} w={65}  h={65}  onSelect={sel} />
        <TRect id="20A" x={155} y={503} w={65}  h={65}  onSelect={sel} />
        <TRect id="22"  x={10}  y={596} w={58}  h={58}  onSelect={sel} />
        <TRect id="24B" x={78}  y={588} w={65}  h={65}  onSelect={sel} />
        <TRect id="24A" x={155} y={588} w={65}  h={65}  onSelect={sel} />
        <TRect id="23B" x={78}  y={672} w={65}  h={65}  onSelect={sel} />
        <TRect id="23A" x={155} y={672} w={65}  h={65}  onSelect={sel} />

        {/* Center column */}
        <TRect id="30"  x={252} y={505} w={67}  h={70}  onSelect={sel} />
        <TRect id="35"  x={254} y={594} w={65}  h={62}  onSelect={sel} />
        <TRect id="33B" x={254} y={675} w={65}  h={62}  onSelect={sel} />

        {/* Right section */}
        <TRect id="300" x={340} y={498} w={124} h={85}  onSelect={sel} />
        <TRect id="34"  x={342} y={591} w={124} h={78}  onSelect={sel} />
        <TRect id="33A" x={342} y={677} w={94}  h={62}  onSelect={sel} />
        <TRect id="301" x={476} y={498} w={96}  h={80}  onSelect={sel} />
        <TRect id="305" x={476} y={586} w={96}  h={88}  onSelect={sel} />
        <TRect id="32"  x={476} y={678} w={108} h={68}  onSelect={sel} />

        {/* Wall Terraza / Vereda */}
        <line x1="2" y1="750" x2="588" y2="750" stroke="#c4a878" strokeWidth="2" />

        {/* ── VEREDA (y 750–868) ──────────────────────────────────── */}
        <rect x="3" y="750" width="584" height="118" fill="#ebebeb" />
        <text x="295" y="768" textAnchor="middle" className="tm-section">Vereda</text>
        <text x="295" y="783" textAnchor="middle" className="tm-note">Obs: vereda no se reserva</text>

        <TCircle id="41" cx={66}  cy={812} r={33} onSelect={sel} />
        <TCircle id="40" cx={162} cy={812} r={33} onSelect={sel} />
        <TCircle id="42" cx={114} cy={857} r={27} onSelect={sel} />
        <TCircle id="50" cx={420} cy={812} r={33} onSelect={sel} />
        <TCircle id="51" cx={516} cy={812} r={33} onSelect={sel} />
        <TCircle id="52" cx={468} cy={857} r={27} onSelect={sel} />

        {/* ── Próximamente ───────────────────────────────────────── */}
        <text x="295" y="896" textAnchor="middle" className="tm-section tm-prox">Próximamente</text>
      </svg>

      {/* Legend */}
      <div className="tm-legend">
        <div className="tm-legend__item">
          <span className="tm-legend__swatch tm-legend__swatch--avail" />
          <span>Disponible — hacé click para reservar</span>
        </div>
        <div className="tm-legend__item">
          <span className="tm-legend__swatch tm-legend__swatch--nobook" />
          <span>No reservable</span>
        </div>
      </div>
    </div>
  )
}
