import { MESA_MAP } from '../data/mesas'
import './TableMap.css'

// ─── Table primitives ─────────────────────────────────────────────────────────

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

function TEllipse({ id, cx, cy, rx, ry, onSelect }) {
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
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      <text x={cx} y={cy - (reservable ? 7 : 0)} textAnchor="middle" dominantBaseline="middle"
        className={`tm-num ${smallLabel ? '' : 'tm-num--lg'}`}>
        {id}
      </text>
      {reservable && (
        <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle" className="tm-cap">
          {mesa.min}–{mesa.max}p
        </text>
      )}
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TableMap({ onTableSelect }) {
  function sel(mesa) { onTableSelect(mesa) }

  // Section Y boundaries
  const Y_BARRA   = 0
  const Y_SALON   = 52
  const Y_MID     = 490
  const Y_BOT     = 737
  const Y_END     = 840

  return (
    <div className="tm-wrapper">
      <svg
        viewBox={`0 0 560 ${Y_END}`}
        className="tm-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Plano de mesas del restaurante"
      >
        {/* ── Outer border ─────────────────────────────────────── */}
        <rect x="1" y="1" width="558" height={Y_END - 2} rx="6"
          fill="none" stroke="#d4c4a8" strokeWidth="2" />

        {/* ── BARRA header ─────────────────────────────────────── */}
        <rect x="1" y={Y_BARRA} width="558" height={Y_SALON} rx="6"
          fill="#f0ebe0" stroke="none" />
        <rect x="1" y={Y_SALON - 8} width="558" height="8" fill="#f0ebe0" />
        <line x1="1" y1={Y_SALON} x2="559" y2={Y_SALON}
          stroke="#d4c4a8" strokeWidth="1.5" />
        <text x="280" y="33" textAnchor="middle" className="tm-section">Barra</text>

        {/* ── SALÓN (Y_SALON → Y_MID) ──────────────────────────── */}
        <rect x="1" y={Y_SALON} width="558" height={Y_MID - Y_SALON}
          fill="#faf8f5" stroke="none" />

        {/* Left column */}
        <TRect    id="16" x={16}  y={70}  w={67} h={47} onSelect={sel} />
        <TRect    id="15" x={16}  y={162} w={67} h={47} onSelect={sel} />
        <TCircle  id="14" cx={52} cy={293} r={40}        onSelect={sel} />
        <TRect    id="12" x={16}  y={402} w={67} h={47} onSelect={sel} />

        {/* Center-left cluster */}
        <TCircle  id="10" cx={200} cy={92}  r={26}             onSelect={sel} />
        <TRect    id="8"  x={252}  y={66}   w={44} h={44}      onSelect={sel} />
        <TEllipse id="11" cx={195} cy={222} rx={41} ry={57}    onSelect={sel} />
        <TRect    id="9"  x={252}  y={169}  w={44} h={44}      onSelect={sel} />

        {/* Vertical wall */}
        <rect x={296} y={60} width={8} height={375} rx={2}
          fill="#d4c4a8" stroke="#c4a878" strokeWidth="1" />

        {/* Right of wall */}
        <TCircle  id="7" cx={364} cy={92}  r={34} onSelect={sel} />
        <TCircle  id="6" cx={364} cy={272} r={38} onSelect={sel} />

        {/* Mesa 5 at base of wall */}
        <TRect id="5" x={272} y={412} w={52} h={52} onSelect={sel} />

        {/* Far right column */}
        <TEllipse id="2" cx={492} cy={108} rx={55} ry={43}     onSelect={sel} />
        <TRect    id="3" x={456}  y={209}  w={82}  h={150}     onSelect={sel} />
        <TRect    id="4" x={458}  y={412}  w={76}  h={50}      onSelect={sel} />

        {/* ── Divider: salón / medio ────────────────────────────── */}
        <line x1="1" y1={Y_MID} x2="559" y2={Y_MID}
          stroke="#d4c4a8" strokeWidth="2" />

        {/* ── SECCIÓN MEDIA (Y_MID → Y_BOT) ───────────────────── */}
        <rect x="1" y={Y_MID} width="558" height={Y_BOT - Y_MID}
          fill="#f4f8f0" stroke="none" />

        {/* Vertical center divider */}
        <line x1="288" y1={Y_MID} x2="288" y2={Y_BOT}
          stroke="#d4c4a8" strokeWidth="2" />

        {/* Left half */}
        <TRect id="21"  x={14}  y={506} w={52} h={56} onSelect={sel} />
        <TRect id="20B" x={86}  y={499} w={64} h={64} onSelect={sel} />
        <TRect id="20A" x={170} y={499} w={64} h={64} onSelect={sel} />

        <TRect id="22"  x={14}  y={588} w={52} h={56} onSelect={sel} />
        <TRect id="24B" x={86}  y={584} w={64} h={64} onSelect={sel} />

        <TRect id="23"  x={116} y={672} w={64} h={54} onSelect={sel} />

        {/* Right half */}
        <TRect id="30"  x={302} y={496} w={66} h={74} onSelect={sel} />
        <TRect id="300" x={386} y={492} w={72} h={66} onSelect={sel} />
        <TRect id="301" x={477} y={492} w={74} h={66} onSelect={sel} />

        <TRect id="35"  x={302} y={588} w={66} h={64} onSelect={sel} />
        <TRect id="34"  x={386} y={579} w={72} h={66} onSelect={sel} />
        <TRect id="305" x={477} y={580} w={74} h={72} onSelect={sel} />

        <TRect id="33B" x={302} y={670} w={66} h={54} onSelect={sel} />
        <TRect id="33A" x={380} y={664} w={82} h={54} onSelect={sel} />
        <TRect id="32"  x={470} y={658} w={80} h={70} onSelect={sel} />

        {/* ── Divider: medio / vereda ───────────────────────────── */}
        <line x1="1" y1={Y_BOT} x2="559" y2={Y_BOT}
          stroke="#d4c4a8" strokeWidth="2" />

        {/* ── VEREDA (Y_BOT → Y_END) ───────────────────────────── */}
        <rect x="1" y={Y_BOT} width="558" height={Y_END - Y_BOT - 1}
          fill="#ebebeb" stroke="none" />

        <TRect id="41" x={16}  y={756} w={80} h={60} onSelect={sel} />
        <TRect id="40" x={182} y={756} w={80} h={60} onSelect={sel} />
        <TRect id="50" x={312} y={756} w={80} h={60} onSelect={sel} />
        <TRect id="51" x={462} y={756} w={82} h={60} onSelect={sel} />
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
