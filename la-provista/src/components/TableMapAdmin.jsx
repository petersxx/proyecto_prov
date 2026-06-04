import { MESA_MAP } from '../data/mesas'
import './TableMapAdmin.css'

const ESTADO_FILL = {
  Pendiente:  '#fde68a',
  Confirmada: '#93c5fd',
  Ocupada:    '#fca5a5',
}

function TableShape({ id, shape, coords, mesaEstados, onTableClick }) {
  const mesa = MESA_MAP[id]
  if (!mesa) return null

  const estado = mesaEstados[id] || null
  const fill = estado ? ESTADO_FILL[estado] : null
  const reservable = mesa.reservable !== false
  const smallLabel = id.length > 3

  const cls = [
    'tma-table',
    reservable ? 'tma-table--clickable' : 'tma-table--nobook',
    estado ? `tma-table--${estado.toLowerCase()}` : '',
  ].join(' ')

  function handleClick() {
    if (reservable) onTableClick(mesa)
  }

  let labelX, labelY, shape1
  if (shape === 'rect') {
    const { x, y, w, h } = coords
    labelX = x + w / 2
    labelY = y + h / 2
    shape1 = <rect x={x} y={y} width={w} height={h} rx={4} fill={fill || undefined} />
  } else if (shape === 'circle') {
    const { cx, cy, r } = coords
    labelX = cx; labelY = cy
    shape1 = <circle cx={cx} cy={cy} r={r} fill={fill || undefined} />
  } else {
    const { cx, cy, rx, ry } = coords
    labelX = cx; labelY = cy
    shape1 = <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill || undefined} />
  }

  return (
    <g className={cls} onClick={handleClick}
      role={reservable ? 'button' : undefined}
      aria-label={reservable ? `Mesa ${id}` : undefined}>
      {shape1}
      <text x={labelX} y={labelY - (reservable ? 6 : 0)}
        textAnchor="middle" dominantBaseline="middle"
        className={`tma-num ${smallLabel ? '' : 'tma-num--lg'}`}>
        {id}
      </text>
      {reservable && (
        <text x={labelX} y={labelY + 10}
          textAnchor="middle" dominantBaseline="middle" className="tma-cap">
          {mesa.min}–{mesa.max}p
        </text>
      )}
    </g>
  )
}

function TR(props)  { return <TableShape shape="rect"    {...props} /> }
function TC(props)  { return <TableShape shape="circle"  {...props} /> }
function TE(props)  { return <TableShape shape="ellipse" {...props} /> }

export default function TableMapAdmin({ mesaEstados = {}, onTableClick }) {
  const Y_SALON = 52
  const Y_MID   = 490
  const Y_BOT   = 737
  const Y_END   = 840

  return (
    <div className="tma-wrapper">
      <svg viewBox={`0 0 560 ${Y_END}`} className="tma-svg"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="558" height={Y_END - 2} rx="6"
          fill="none" stroke="#d4c4a8" strokeWidth="2" />

        {/* Barra */}
        <rect x="1" y={0} width="558" height={Y_SALON} rx="6" fill="#f0ebe0" stroke="none" />
        <rect x="1" y={Y_SALON - 8} width="558" height="8" fill="#f0ebe0" />
        <line x1="1" y1={Y_SALON} x2="559" y2={Y_SALON} stroke="#d4c4a8" strokeWidth="1.5" />
        <text x="280" y="33" textAnchor="middle" className="tma-section">Barra</text>

        {/* Salón */}
        <rect x="1" y={Y_SALON} width="558" height={Y_MID - Y_SALON} fill="#faf8f5" stroke="none" />
        <TR id="16" coords={{ x:16,  y:70,  w:67, h:47 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="15" coords={{ x:16,  y:162, w:67, h:47 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TC id="14" coords={{ cx:52, cy:293, r:40 }}       mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="12" coords={{ x:16,  y:402, w:67, h:47 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TC id="10" coords={{ cx:200, cy:92,  r:26 }}      mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="8"  coords={{ x:252, y:66,  w:44, h:44 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TE id="11" coords={{ cx:195, cy:222, rx:41, ry:57 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="9"  coords={{ x:252, y:169, w:44, h:44 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <rect x={296} y={60} width={8} height={375} rx={2} fill="#d4c4a8" stroke="#c4a878" strokeWidth="1" />
        <TC id="7"  coords={{ cx:364, cy:92,  r:34 }}      mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TC id="6"  coords={{ cx:364, cy:272, r:38 }}      mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="5"  coords={{ x:272, y:412, w:52, h:52 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TE id="2"  coords={{ cx:492, cy:108, rx:55, ry:43 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="3"  coords={{ x:456, y:209, w:82, h:150 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="4"  coords={{ x:458, y:412, w:76, h:50 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />

        <line x1="1" y1={Y_MID} x2="559" y2={Y_MID} stroke="#d4c4a8" strokeWidth="2" />

        {/* Terraza */}
        <rect x="1" y={Y_MID} width="558" height={Y_BOT - Y_MID} fill="#f4f8f0" stroke="none" />
        <line x1="288" y1={Y_MID} x2="288" y2={Y_BOT} stroke="#d4c4a8" strokeWidth="2" />
        <TR id="21"  coords={{ x:14,  y:506, w:52, h:56 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="20B" coords={{ x:86,  y:499, w:64, h:64 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="20A" coords={{ x:170, y:499, w:64, h:64 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="22"  coords={{ x:14,  y:588, w:52, h:56 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="24B" coords={{ x:86,  y:584, w:64, h:64 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="23"  coords={{ x:116, y:672, w:64, h:54 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="30"  coords={{ x:302, y:496, w:66, h:74 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="300" coords={{ x:386, y:492, w:72, h:66 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="301" coords={{ x:477, y:492, w:74, h:66 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="35"  coords={{ x:302, y:588, w:66, h:64 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="34"  coords={{ x:386, y:579, w:72, h:66 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="305" coords={{ x:477, y:580, w:74, h:72 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="33B" coords={{ x:302, y:670, w:66, h:54 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="33A" coords={{ x:380, y:664, w:82, h:54 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="32"  coords={{ x:470, y:658, w:80, h:70 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />

        <line x1="1" y1={Y_BOT} x2="559" y2={Y_BOT} stroke="#d4c4a8" strokeWidth="2" />

        {/* Vereda */}
        <rect x="1" y={Y_BOT} width="558" height={Y_END - Y_BOT - 1} fill="#ebebeb" stroke="none" />
        <TR id="41" coords={{ x:16,  y:756, w:80, h:60 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="40" coords={{ x:182, y:756, w:80, h:60 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="50" coords={{ x:312, y:756, w:80, h:60 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
        <TR id="51" coords={{ x:462, y:756, w:82, h:60 }} mesaEstados={mesaEstados} onTableClick={onTableClick} />
      </svg>
    </div>
  )
}
