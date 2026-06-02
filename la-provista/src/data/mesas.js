export const MESAS = [
  // ── Salón / Barra ──────────────────────────────────────────────────────────
  { id: '16',  nombre: 'Mesa 16',  zona: 'salon',   min: 2, max: 2,  forma: 'rect'    },
  { id: '15',  nombre: 'Mesa 15',  zona: 'salon',   min: 6, max: 8,  forma: 'rect'    },
  { id: '14',  nombre: 'Mesa 14',  zona: 'salon',   min: 4, max: 5,  forma: 'circle'  },
  { id: '12',  nombre: 'Mesa 12',  zona: 'salon',   min: 2, max: 2,  forma: 'rect'    },
  { id: '10',  nombre: 'Mesa 10',  zona: 'salon',   min: 2, max: 3,  forma: 'circle'  },
  { id: '8',   nombre: 'Mesa 8',   zona: 'salon',   min: 2, max: 2,  forma: 'rect'    },
  { id: '11',  nombre: 'Mesa 11',  zona: 'salon',   min: 4, max: 6,  forma: 'ellipse' },
  { id: '9',   nombre: 'Mesa 9',   zona: 'salon',   min: 3, max: 4,  forma: 'rect'    },
  { id: '7',   nombre: 'Mesa 7',   zona: 'salon',   min: 3, max: 4,  forma: 'circle'  },
  { id: '6',   nombre: 'Mesa 6',   zona: 'salon',   min: 4, max: 5,  forma: 'circle'  },
  { id: '5',   nombre: 'Mesa 5',   zona: 'salon',   min: 2, max: 3,  forma: 'rect'    },
  { id: '2',   nombre: 'Mesa 2',   zona: 'salon',   min: 6, max: 7,  forma: 'ellipse' },
  { id: '3',   nombre: 'Mesa 3',   zona: 'salon',   min: 8, max: 10, forma: 'rect'    },
  { id: '4',   nombre: 'Mesa 4',   zona: 'salon',   min: 2, max: 2,  forma: 'rect'    },

  // ── Terraza ────────────────────────────────────────────────────────────────
  { id: '21',  nombre: 'Mesa 21',  zona: 'terraza', min: 2, max: 2,  forma: 'rect'    },
  { id: '20B', nombre: 'Mesa 20B', zona: 'terraza', min: 3, max: 4,  forma: 'rect'    },
  { id: '20A', nombre: 'Mesa 20A', zona: 'terraza', min: 2, max: 3,  forma: 'rect'    },
  { id: '22',  nombre: 'Mesa 22',  zona: 'terraza', min: 2, max: 2,  forma: 'rect'    },
  { id: '24B', nombre: 'Mesa 24B', zona: 'terraza', min: 3, max: 4,  forma: 'rect'    },
  { id: '23',  nombre: 'Mesa 23',  zona: 'terraza', min: 2, max: 4,  forma: 'rect'    },
  { id: '30',  nombre: 'Mesa 30',  zona: 'terraza', min: 2, max: 3,  forma: 'rect'    },
  { id: '300', nombre: 'Mesa 300', zona: 'terraza', min: 6, max: 8,  forma: 'rect'    },
  { id: '301', nombre: 'Mesa 301', zona: 'terraza', min: 2, max: 3,  forma: 'rect'    },
  { id: '35',  nombre: 'Mesa 35',  zona: 'terraza', min: 2, max: 2,  forma: 'rect'    },
  { id: '34',  nombre: 'Mesa 34',  zona: 'terraza', min: 4, max: 6,  forma: 'rect'    },
  { id: '305', nombre: 'Mesa 305', zona: 'terraza', min: 3, max: 4,  forma: 'rect'    },
  { id: '33B', nombre: 'Mesa 33B', zona: 'terraza', min: 2, max: 2,  forma: 'rect'    },
  { id: '33A', nombre: 'Mesa 33A', zona: 'terraza', min: 2, max: 3,  forma: 'rect'    },
  { id: '32',  nombre: 'Mesa 32',  zona: 'terraza', min: 6, max: 8,  forma: 'rect'    },

  // ── Vereda (no se reserva) ─────────────────────────────────────────────────
  { id: '41',  nombre: 'Mesa 41',  zona: 'vereda',  min: 2, max: 4,  forma: 'rect', reservable: false },
  { id: '40',  nombre: 'Mesa 40',  zona: 'vereda',  min: 2, max: 4,  forma: 'rect', reservable: false },
  { id: '50',  nombre: 'Mesa 50',  zona: 'vereda',  min: 2, max: 4,  forma: 'rect', reservable: false },
  { id: '51',  nombre: 'Mesa 51',  zona: 'vereda',  min: 2, max: 4,  forma: 'rect', reservable: false },
]

export const MESA_MAP = Object.fromEntries(
  MESAS.map(m => [m.id, { reservable: true, ...m }])
)

export const ZONA_LABELS = {
  barra:   'Zona de Barra',
  salon:   'Salón',
  terraza: 'Terraza',
  vereda:  'Vereda',
}
