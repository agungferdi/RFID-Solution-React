import { useEffect, useState } from 'react'

/* ─────────────────────────────────────────────────────────────
   FLOW STEPS
   actor: 'dt' | 'rfid' | 'system'
   type:  'node' | 'rfid' | 'document' | 'decision' | 'terminus'
───────────────────────────────────────────────────────────────*/
const STEPS = [
  /* ── PRE-DEPLOYMENT ── */
  {
    id: 'tag-writing',
    actor: 'system',
    type: 'node',
    icon: '✎',
    label: 'EPC Tag Writing — V90 M & Driver RFID Card',
    desc: 'Before any DT enters service, each V90 M windshield tag and each driver RFID card is programmed with a unique EPC ID using the R1 desktop reader/writer. IDs are registered in the RFID middleware and bound to DT fleet records and driver personnel profiles. Tags are locked after writing to prevent tampering.',
    note: 'One-time setup per DT unit and per driver. Tags are reusable — only re-programmed on reassignment.',
    gear: ['r1', 'v90m', 'card'],
  },

  /* ── PIT DEPARTURE ── */
  {
    id: 'dt-depart',
    actor: 'dt',
    type: 'node',
    icon: '🚛',
    label: 'Dump Truck Loaded — Departs PIT',
    desc: 'DT is loaded with coal at the mining pit face and begins the hauling route toward the weighbridge. The V90 M tags are affixed permanently on both the left and right side of the front windshield interior.',
    note: null,
    gear: [],
  },
  {
    id: 'pit-gate',
    actor: 'rfid',
    type: 'rfid',
    icon: '⬡',
    label: 'PIT Exit Gate — DT Out + Driver ID Captured',
    desc: 'Two panel antennas (9 or 12 dBi) mounted on poles at the PIT exit gate simultaneously read both V90 M tags on the left and right front windshield as the DT drives through — DT identity confirmed, "OUT from PIT" event logged. At the same moment, the driver opens the cab window and presents their RFID card toward the nearest antenna — driver identity is captured and linked to the DT event. Both reads are merged in the RFID middleware as a single departure record.',
    note: 'V90 M: fully automatic hands-free read. Driver card: requires window open + card presented toward antenna.',
    gear: ['ura4', 'ant912', 'v90m', 'card'],
    location: 'PIT Exit Gate · 2× Pole-Mounted Panel Antennas',
  },

  /* ── WEIGHBRIDGE ENTRY (GROSS) ── */
  {
    id: 'gate-in',
    actor: 'rfid',
    type: 'rfid',
    icon: '⬡',
    label: 'Weighbridge Entry Gate — RFID Auto-ID',
    desc: 'As the loaded DT enters the weighbridge zone, the URA4 fixed reader (powered by PoE) and two 9 dBi panel antennas flanking the entry lane instantly read the V90 M windshield tags — completely hands-free. Tag ID, timestamp, and lane direction are logged. No card handling or barcode scanning.',
    note: 'Reads DT at full approach speed — no stopping required.',
    gear: ['ura4', 'ant912', 'v90m'],
    location: 'Jembatan Timbang · Entry Lane · URA4 + 2× Panel Antenna',
  },
  {
    id: 'sys-validate-in',
    actor: 'system',
    type: 'node',
    icon: '✓',
    label: 'System Validates DT & Driver Identity',
    desc: 'The incoming tag EPC is matched against the fleet database. Operator screen displays: DT unit number, driver name, assigned plate, last recorded Tare Weight, and pre-assigned ROM destination — all within 300 ms of the tag read.',
    note: null,
    gear: [],
  },
  {
    id: 'gross-weight',
    actor: 'system',
    type: 'node',
    icon: '⚖',
    label: 'Gross Weight + RFID Data Merged & Stored',
    desc: 'DT moves onto the platform scale. The live scale reading is merged with the RFID event data (DT ID, driver ID, timestamp, lane) into a single immutable record in the RFID middleware. The site officer at the weighbridge cabin assigns the ROM destination manually — or the system auto-assigns based on ROM stock capacity and sends a push notification to the driver\'s smartphone, directing them to the correct Stock ROM.',
    note: 'ROM destination is shown on the operator screen at the weighbridge AND sent as a smartphone push notification to the driver app.',
    gear: [],
  },
  {
    id: 'ticket-out',
    actor: 'system',
    type: 'document',
    icon: '🗎',
    label: 'Digital Weighing Ticket Generated',
    desc: 'Electronic ticket auto-created: DT ID, V90 M tag serial, driver ID, Gross Weight, assigned ROM, and timestamp. Printout optional — ticket syncs to WMS/ERP in real time via REST API. A barcode of the EPC ID is included for legacy compatibility with manual systems.',
    note: 'Digital ticket is the authoritative record — printed copy is for human reference only.',
    gear: [],
  },

  /* ── HAUL & ROM ── */
  {
    id: 'haul-rom',
    actor: 'dt',
    type: 'node',
    icon: '🚛',
    label: 'DT Hauls to Assigned Stock ROM',
    desc: 'Driver proceeds to the ROM location shown on the digital ticket and confirmed by the smartphone notification. The V90 M tag passively identifies the DT at any checkpoint along the route without driver action.',
    note: null,
    gear: [],
  },
  {
    id: 'rom-gate',
    actor: 'rfid',
    type: 'rfid',
    icon: '⬡',
    label: 'Stock ROM Gate — Real-Time Unload Monitoring',
    desc: 'A URA4 fixed reader with 2× 9 or 12 dBi panel antennas at the Stock ROM entry gate reads the V90 M windshield tags as the DT arrives. System confirms: correct DT for this ROM, correct driver, valid ticket. The real-time dashboard immediately shows which DT is unloading at which ROM stock pile. URA4 continues monitoring — when the DT exits the ROM zone, the unload duration is automatically calculated and added to the production record.',
    note: 'URA4 detects both ROM entry and exit — no manual check-in/out needed at the ROM.',
    gear: ['ura4', 'ant912', 'v90m'],
    location: 'Stock ROM · Entry / Exit Gate · URA4 + 2× Panel Antenna',
  },
  {
    id: 'unload',
    actor: 'dt',
    type: 'node',
    icon: '⛏',
    label: 'Coal Unloaded at Stock ROM',
    desc: 'DT tips and unloads coal at the verified ROM location. The V90 M tag — continuously in range of the URA4 ROM reader — provides real-time presence confirmation: the system knows this exact DT, driven by this exact driver, is at this ROM, at this time. Full chain-of-custody with no manual recording.',
    note: null,
    gear: [],
  },

  /* ── RETURN & TARE ── */
  {
    id: 'return-drive',
    actor: 'dt',
    type: 'node',
    icon: '↩',
    label: 'DT Returns to Weighbridge — All Data Pushed via API',
    desc: 'Empty DT heads back to the weighbridge for the tare weighing cycle. At this point, all accumulated cycle data has already been continuously pushed via REST API: DT ID, driver ID, PIT departure time, weighbridge entry time, Gross Weight, ROM assignment, ROM arrival/departure confirmation, and unload duration. The middleware, WMS, and ERP all hold a live partial record — the tare capture will complete it.',
    note: 'API push is continuous throughout the cycle — not a batch at end. Partial records are queryable in real time.',
    gear: [],
  },
  {
    id: 'gate-tare',
    actor: 'rfid',
    type: 'rfid',
    icon: '⬡',
    label: 'Weighbridge Return Gate — RFID Auto-ID (Tare Cycle)',
    desc: 'The same URA4 and antenna pair reads the V90 M tags again as the empty DT enters the return lane. The middleware links this read to the earlier Gross Weight event by matching the EPC ID and validating that the ROM delivery was confirmed. Direction logic in the RFID software distinguishes entry from return.',
    note: 'Same physical hardware, same reader — direction determined by read-sequence logic in middleware.',
    gear: ['ura4', 'ant912', 'v90m'],
    location: 'Jembatan Timbang · Return Lane · Same URA4 Gate',
  },
  {
    id: 'verify-empty',
    actor: 'system',
    type: 'decision',
    icon: '◇',
    label: 'System Verifies DT is Empty & ROM Confirmed',
    desc: 'System cross-checks: returning EPC ID matches a pending gross-weight record, ROM arrival was logged by the Stock ROM URA4, and unload was confirmed. Visual display + live scale pre-check ensures the DT bed is empty before tare is accepted.',
    note: null,
    gear: [],
  },
  {
    id: 'tare-net',
    actor: 'system',
    type: 'node',
    icon: '⚖',
    label: 'Tare Weight Captured → Net Weight Auto-Calculated',
    desc: 'Scale captures tare weight of the empty DT. System instantly computes: Net Weight = Gross − Tare, writes it to the production record, and locks the transaction. Zero manual entry, zero transcription error. The complete cycle record — DT, driver, Gross, Tare, Net, ROM, all timestamps — is now final.',
    note: 'Accuracy is limited only by the scale hardware, not data entry.',
    gear: [],
  },
  {
    id: 'report',
    actor: 'system',
    type: 'document',
    icon: '📊',
    label: 'Production Report — Full Cycle Record Completed',
    desc: 'Final coal hauling cycle record: DT unit, driver, V90 M tag ID, Gross / Tare / Net weights, ROM destination, PIT departure time, weighbridge timestamps, ROM arrival/exit, unload duration, and cycle duration. Automatically pushed to RFID Middleware, WMS, and ERP. Tamper-proof audit trail anchored to RFID tag chain-of-custody.',
    note: 'Each cycle is a single RFID-anchored production event — immutable once completed.',
    gear: [],
  },

  /* ── RETURN TO PIT ── */
  {
    id: 'return-pit',
    actor: 'rfid',
    type: 'rfid',
    icon: '🔄',
    label: 'PIT Entry Gate — URA4 Second Read: Cycle Closed',
    desc: 'As the empty DT re-enters the PIT, the same URA4 gate and antenna pair at the PIT reads the V90 M windshield tags for the second time. The middleware reads this as "IN to PIT" — the hauling cycle is formally closed in the system. The DT status changes from "On Cycle" to "Available in PIT" in the real-time fleet dashboard. Driver is ready for the next load.',
    note: 'Same gate hardware, second read = cycle close. Direction logic: OUT read #1 (departure) → IN read #2 (return).',
    gear: ['ura4', 'ant912', 'v90m'],
    location: 'PIT Entry Gate · Second Read = Cycle Close',
  },
]

/* ─────────────────────────────────────────────────────────────
   GEAR CATALOGUE
───────────────────────────────────────────────────────────────*/
const GEAR = {
  r1: {
    name: 'R1 Desktop RFID Reader / Writer',
    sub: 'UHF · EPC C1 Gen2 · USB · Batch programming',
    color: '#a78bfa',
    key: 'r1',
    bullets: [
      'Programs V90 M windshield tags with unique DT EPC IDs',
      'Programs driver RFID cards with personnel IDs',
      'Writes are linked to DT fleet & driver records in middleware',
      'Tags locked post-write — tamper-evident serial chain',
    ],
  },
  v90m: {
    name: 'DTB-V90 M Windshield Tag',
    sub: 'UHF · EPC C1 Gen2 · ISO 18000-6C · On-glass mount',
    color: '#35b39a',
    key: 'v90m',
    bullets: [
      'One on left and one on right front windshield interior',
      'Reads through glass — no direct line-of-sight required',
      'Unique 128-bit EPC ID pre-written via R1, locked to DT record',
      'Passive — no battery. Survives mine site heat, vibration, dust',
    ],
  },
  card: {
    name: 'Driver RFID Card',
    sub: 'PVC/PET · UHF · ISO 18000-6C · Wallet form factor',
    color: '#fbbf24',
    key: 'card',
    bullets: [
      'Each driver carries one card linked to their personnel ID',
      'At PIT gate: driver opens window and presents card toward antenna',
      'System captures DT ID (V90M) + driver ID (card) in one event',
      'Proves chain of custody: who was driving which DT on which cycle',
    ],
  },
  ura4: {
    name: 'URA4 Fixed RFID Reader',
    sub: '4-Port TNC · Android 13 · Impinj E Series · PoE/DC',
    color: '#ff6820',
    key: 'ura4',
    bullets: [
      'Installed at: PIT gate, weighbridge entry/return, Stock ROM gate',
      'Reads V90 M tags at full vehicle driving speed — no stopping',
      'PoE 802.3at powered — single cable for power + data',
      'Streams events to middleware via LAN or Wi-Fi in real time',
    ],
  },
  ant912: {
    name: 'Panel Antenna · 9 dBi or 12 dBi',
    sub: 'IP67 · TNC · 60–55° beam (9 dBi) / 40–38° beam (12 dBi)',
    color: '#ff9240',
    key: 'ant9',
    bullets: [
      '2 units per gate — one each side of the DT lane on poles',
      'Positioned at DT windshield height for direct tag coverage',
      '9 dBi: wider beam for standard lane widths (up to 9 m)',
      '12 dBi: tighter long-range beam for wider or deeper ROM zones',
    ],
  },
  c72: {
    name: 'C72 Handheld RFID Reader',
    sub: 'Android 13 · 1W UHF · IP65 · 8 000 mAh',
    color: '#00c8ff',
    key: 'c72',
    bullets: [
      'Mobile fallback for checkpoints without fixed URA4 installation',
      'ROM checker can scan approaching DT from safe standoff distance',
      'On-device app shows: DT ID, expected ROM, driver, weight data',
      'Offline-capable — syncs events to server when WiFi available',
    ],
  },
}

const ACTOR_META = {
  dt:     { label: 'Driver DT',   color: '#ff6820' },
  rfid:   { label: 'RFID Gate',   color: '#00c8ff' },
  system: { label: 'IT System',   color: '#35b39a' },
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────*/
function GearCard({ gearKey, images }) {
  const g = GEAR[gearKey]
  if (!g) return null
  const imgSrc = images[g.key]

  return (
    <div className="mf-gear-card" style={{ '--gc': g.color }}>
      <div className="mf-gear-card-top">
        <div className="mf-gear-img-wrap">
          {imgSrc ? (
            <img src={imgSrc} alt={g.name} className="mf-gear-img" />
          ) : (
            <div className="mf-gear-placeholder-icon">◈</div>
          )}
        </div>
        <div className="mf-gear-info">
          <div className="mf-gear-name">{g.name}</div>
          <div className="mf-gear-sub">{g.sub}</div>
        </div>
      </div>
      <ul className="mf-gear-bullets">
        {g.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  )
}

function FlowNode({ step, index, isActive, onClick }) {
  const actor = ACTOR_META[step.actor]
  const isRfid = step.type === 'rfid'
  const isDoc  = step.type === 'document'
  const isDec  = step.type === 'decision'

  return (
    <div className={`mf-node-wrap ${isRfid ? 'mf-node-rfid-wrap' : ''}`}>
      {index > 0 && (
        <div className={`mf-connector ${isRfid ? 'mf-connector-rfid' : ''}`}>
          <div className="mf-connector-dot" style={{ '--dc': actor.color }} />
        </div>
      )}

      <button
        type="button"
        className={[
          'mf-node',
          `mf-node-${step.actor}`,
          isRfid ? 'mf-node-rfid' : '',
          isDoc  ? 'mf-node-doc'  : '',
          isDec  ? 'mf-node-dec'  : '',
          isActive ? 'mf-node-active' : '',
        ].filter(Boolean).join(' ')}
        style={{ '--nc': actor.color }}
        onClick={() => onClick(step.id)}
        aria-pressed={isActive}
      >
        <div className="mf-node-left">
          <span className="mf-node-actor-badge" style={{ background: actor.color }}>
            {actor.label}
          </span>
          {isRfid && (
            <div className="mf-node-rfid-rings" aria-hidden="true">
              <div className="mf-rfid-ring" />
              <div className="mf-rfid-ring" style={{ animationDelay: '0.6s' }} />
              <div className="mf-rfid-ring" style={{ animationDelay: '1.2s' }} />
            </div>
          )}
        </div>

        <div className="mf-node-body">
          <div className="mf-node-label-row">
            <span className="mf-node-icon" aria-hidden="true">{step.icon}</span>
            <span className="mf-node-label">{step.label}</span>
            {step.gear.length > 0 && (
              <span className="mf-node-gear-count">{step.gear.length} device{step.gear.length > 1 ? 's' : ''}</span>
            )}
          </div>
          {step.note && <div className="mf-node-note">{step.note}</div>}
          {isRfid && step.location && (
            <div className="mf-node-location">{step.location}</div>
          )}
        </div>

        <div className="mf-node-chevron" aria-hidden="true">›</div>
      </button>
    </div>
  )
}

function DetailPanel({ step, images }) {
  if (!step) {
    return (
      <div className="mf-detail-empty">
        <div className="mf-detail-empty-icon">←</div>
        <div className="mf-detail-empty-text">Select any step to see full details and equipment used</div>
      </div>
    )
  }

  const actor = ACTOR_META[step.actor]

  return (
    <div className="mf-detail" key={step.id}>
      <div className="mf-detail-header" style={{ '--dc': actor.color }}>
        <div className="mf-detail-actor">{actor.label}</div>
        <div className="mf-detail-title">{step.label}</div>
        {step.location && (
          <div className="mf-detail-location">
            <span className="mf-detail-location-dot" style={{ background: actor.color }} />
            {step.location}
          </div>
        )}
      </div>

      <div className="mf-detail-body">
        <p className="mf-detail-desc">{step.desc}</p>

        {step.note && (
          <div className="mf-detail-callout">
            <span className="mf-detail-callout-icon">!</span>
            <span>{step.note}</span>
          </div>
        )}

        {step.gear.length > 0 && (
          <div className="mf-detail-gear-section">
            <div className="mf-detail-gear-heading">Equipment at this step</div>
            {step.gear.map((gk) => (
              <GearCard key={gk} gearKey={gk} images={images} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────────────────────────────*/
export function MiningFlowModal({ isOpen, onClose, images }) {
  const [activeId, setActiveId] = useState('pit-gate')

  const activeStep = STEPS.find((s) => s.id === activeId) ?? null

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="mf-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="mf-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Supply Chain Mining — RFID Weighbridge Flow"
      >
        {/* ── HEADER ── */}
        <div className="mf-panel-header">
          <div className="mf-panel-header-left">
            <div className="mf-panel-eyebrow">RFID Solution · Mining Operations · Coal Hauling</div>
            <h2 className="mf-panel-title">Weighbridge RFID-Optimised Supply Chain Flow</h2>
            <p className="mf-panel-sub">
              V90 M windshield tags (left + right) on each DT · Driver RFID card identity at PIT gate ·
              URA4 + 2× Panel Antenna at PIT, Weighbridge &amp; Stock ROM · Full hands-free cycle tracking
            </p>
          </div>
          <div className="mf-panel-header-right">
            <div className="mf-legend">
              {Object.entries(ACTOR_META).map(([key, meta]) => (
                <div key={key} className="mf-legend-item">
                  <span className="mf-legend-dot" style={{ background: meta.color }} />
                  <span>{meta.label}</span>
                </div>
              ))}
              <div className="mf-legend-item mf-legend-item-rfid">
                <span className="mf-legend-dot" style={{ background: '#00c8ff', boxShadow: '0 0 5px #00c8ff' }} />
                <span>= RFID Checkpoint</span>
              </div>
            </div>
            <button type="button" className="mf-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="mf-body">
          <div className="mf-flow-col">
            <div className="mf-flow-inner">
              {STEPS.map((step, i) => (
                <FlowNode
                  key={step.id}
                  step={step}
                  index={i}
                  isActive={activeId === step.id}
                  onClick={(id) => setActiveId((prev) => (prev === id ? null : id))}
                />
              ))}
            </div>
          </div>

          <div className="mf-detail-col">
            <DetailPanel step={activeStep} images={images} />
          </div>
        </div>
      </div>
    </div>
  )
}
