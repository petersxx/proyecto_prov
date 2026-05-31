import { useState } from 'react'
import TableMap from '../components/TableMap'
import ReservationModal from '../components/ReservationModal'
import './Reservas.css'

export default function Reservas() {
  const [selectedMesa, setSelectedMesa] = useState(null)

  return (
    <main className="reservas-page">
      <div className="reservas-header">
        <p className="reservas-eyebrow">Reservas</p>
        <h1>Elegí tu mesa</h1>
        <p className="reservas-sub">
          Explorá el plano del restaurante y seleccioná la mesa que más te guste.
        </p>
      </div>

      <div className="reservas-body">
        <TableMap onTableSelect={setSelectedMesa} />
      </div>

      {selectedMesa && (
        <ReservationModal
          mesa={selectedMesa}
          onClose={() => setSelectedMesa(null)}
        />
      )}
    </main>
  )
}
