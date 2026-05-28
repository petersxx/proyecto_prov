import ReservationForm from '../components/ReservationForm'
import './Reservas.css'

export default function Reservas() {
  return (
    <main className="reservas-page">
      <div className="reservas-header">
        <p className="reservas-eyebrow">Reservas</p>
        <h1>Reservá tu mesa</h1>
        <p className="reservas-sub">
          Completá el formulario y te contactamos para confirmar tu reserva.
        </p>
      </div>

      <div className="reservas-body">
        <ReservationForm />
      </div>
    </main>
  )
}
