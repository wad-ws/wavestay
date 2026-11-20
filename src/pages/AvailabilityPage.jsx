import { useState } from 'react'
import { Link } from 'react-router'
import { rooms } from '../data/rooms'
import { availability } from '../data/availability'

const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

function isAvailable(roomId, checkIn, checkOut) {
  if (!checkIn || !checkOut) return true
  const periods = availability[roomId] ?? []
  return !periods.some((p) => p.from < checkOut && p.to > checkIn)
}

export default function AvailabilityPage() {
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const dateError = checkIn && checkOut && checkOut <= checkIn

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  let displayedRooms = rooms.map((room) => ({
    ...room,
    available: dateError ? true : isAvailable(room.id, checkIn, checkOut),
  }))

  if (onlyAvailable) {
    displayedRooms = displayedRooms.filter((r) => r.available)
  }

  if (sortKey) {
    displayedRooms = [...displayedRooms].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  function sortIndicator(key) {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold text-ink">Disponibilités</h1>

      {/* Sélecteur de dates */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Arrivée
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Départ
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
      </div>

      {dateError && (
        <p className="mb-4 text-sm text-red-600">
          La date de départ doit être postérieure à la date d&apos;arrivée
        </p>
      )}

      {/* Filtre */}
      <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => setOnlyAvailable(e.target.checked)}
        />
        Afficher uniquement les disponibles
      </label>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Chambre{sortIndicator('name')}
              </th>
              <th
                onClick={() => handleSort('surface')}
                className="hidden cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold text-slate-700 md:table-cell"
              >
                Surface (m²){sortIndicator('surface')}
              </th>
              <th className="hidden px-4 py-3 text-left text-sm font-semibold text-slate-700 md:table-cell">
                Type de lit
              </th>
              <th
                onClick={() => handleSort('pricePerNight')}
                className="cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Prix/nuit (€){sortIndicator('pricePerNight')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Disponibilité
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedRooms.map((room) => (
              <tr key={room.id} className="bg-white hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{room.name}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{room.surface}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{room.bedType}</td>
                <td className="px-4 py-3 text-slate-600">{room.pricePerNight} €</td>
                <td className="px-4 py-3">
                  {room.available ? (
                    <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      Disponible
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      Indisponible
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {room.available ? (
                    <Link
                      to={`/booking/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}`}
                      className="bg-gold text-white rounded-full px-4 py-1.5 text-sm"
                    >
                      Réserver
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="opacity-50 bg-gold text-white rounded-full px-4 py-1.5 text-sm"
                    >
                      Réserver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
