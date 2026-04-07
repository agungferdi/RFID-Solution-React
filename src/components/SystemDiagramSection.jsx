function Packet({ delay = 0, color = '#00c8ff', duration = 1.8 }) {
  return (
    <div
      className="pkt"
      style={{
        '--pkt-color': color,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

function VerticalPipe({ color = 'orange', label, packets = [] }) {
  return (
    <div className="vpipe-wrap">
      <div className={`vpipe vpipe-${color}`}>
        {packets.map((p, i) => (
          <Packet key={i} delay={p.delay} color={p.color ?? (color === 'orange' ? '#ff6820' : '#00c8ff')} duration={p.dur ?? 1.8} />
        ))}
      </div>
      {label && <span className="vpipe-label">{label}</span>}
    </div>
  )
}

function SplitPipe() {
  return (
    <div className="split-pipe-row">
      <div className="split-pipe-branch">
        <div className="split-pipe-line split-orange">
          <Packet delay={0} color="#ff6820" />
          <Packet delay={0.9} color="#ff6820" />
        </div>
        <div className="split-pipe-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="2" width="20" height="8" rx="1.5" />
            <rect x="2" y="14" width="20" height="8" rx="1.5" />
            <circle cx="18" cy="6" r="1" fill="currentColor" />
            <circle cx="18" cy="18" r="1" fill="currentColor" />
          </svg>
          LAN / PoE · RJ45
        </div>
      </div>

      <div className="split-pipe-center-line" />

      <div className="split-pipe-branch">
        <div className="split-pipe-line split-blue">
          <Packet delay={0.45} color="#00c8ff" />
          <Packet delay={1.35} color="#00c8ff" />
        </div>
        <div className="split-pipe-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          Wi-Fi 802.11ac
        </div>
      </div>
    </div>
  )
}

export function SystemDiagramSection({ isReady, onBack }) {
  return (
    <section className={`sds-root ${isReady ? 'is-visible' : ''}`}>
      <div className="sds-scroll">
        <header className="sds-header">
          <p className="section-label">End-to-End Architecture</p>
          <h2>Complete RFID Inventory Management</h2>
          <p className="sds-lead">
            Passive tags reflect UHF signals back to readers. Readers forward tag events over
            LAN or Wi-Fi to a central middleware server. WMS and ERP subscribe to processed
            inventory events in real time.
          </p>
        </header>

        <div className="sds-diagram">

          {/* ══ 1. TAGS (top) ══ */}
          <div className="sds-row row-tags">
            <div className="row-aside aside-teal">
              <span className="row-aside-text">RFID Tags</span>
            </div>
            <div className="row-body">
              <div className="tag-cards">
                {[
                  { label: 'Flexible Anti-metal', note: 'On-metal surfaces', icon: '▱' },
                  { label: 'ABS Hard Tag',        note: 'Rugged assets',     icon: '▬' },
                  { label: 'PCB Tag',             note: 'Equipment ID',      icon: '◧' },
                  { label: 'UHF Card',            note: 'Personnel / trays', icon: '▭' },
                ].map((t) => (
                  <div key={t.label} className="tag-card">
                    <div className="tag-card-icon">{t.icon}</div>
                    <div className="tag-card-name">{t.label}</div>
                    <div className="tag-card-note">{t.note}</div>
                  </div>
                ))}
              </div>
              <div className="tag-passive-bar">
                Passive · no battery · backscatter response · EPC 128-bit unique ID · up to 15 m range
              </div>
            </div>
          </div>

          {/* ══ RF ZONE ══ */}
          <div className="rf-zone">
            <div className="rf-zone-waves">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rf-wave" style={{ animationDelay: `${i * 0.45}s` }} />
              ))}
            </div>
            <div className="rf-zone-label">
              <span className="rf-zone-freq">UHF · 860 – 960 MHz</span>
              <span className="rf-zone-proto">EPC C1 Gen2 / ISO 18000-6C · LLRP</span>
            </div>
          </div>

          {/* ══ 2. EDGE READERS ══ */}
          <div className="sds-row row-edge">
            <div className="row-aside aside-split">
              <span className="row-aside-text aside-o">URA4</span>
              <span className="row-aside-divider" />
              <span className="row-aside-text aside-b">C72</span>
            </div>
            <div className="row-body edge-pair">

              {/* URA4 */}
              <div className="edge-card ura4-card">
                <div className="edge-card-head">
                  <span className="edge-live-dot dot-o" />
                  <span className="edge-card-title">URA4 Fixed Reader</span>
                </div>
                <p className="edge-card-desc">
                  Wall or ceiling mounted. Reads up to 1 300+ tags/sec. Powers antennas directly via 4-port TNC array.
                </p>
                <div className="ant-ports">
                  {['5 dBi', '9 dBi', '12 dBi', 'Port 4'].map((p, i) => (
                    <div key={p} className={`ant-port ${i < 3 ? 'ant-active' : ''}`}>
                      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                        <path d="M5 13V7M1 5a5 5 0 0 1 8 0M3 7.5a3 3 0 0 1 4 0" stroke={i < 3 ? '#ff6820' : '#444'} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="edge-card-foot">Android 13 · Impinj E Series · PoE 802.3at / DC 12V</div>
              </div>

              {/* C72 */}
              <div className="edge-card c72-card">
                <div className="edge-card-head">
                  <span className="edge-live-dot dot-b" />
                  <span className="edge-card-title">C72 Handheld Reader</span>
                </div>
                <p className="edge-card-desc">
                  Operator-held. Full Android app for inventory counting, picking, and verification — works offline and syncs on reconnect.
                </p>
                <div className="c72-app-row">
                  <div className="c72-app-node">
                    <svg width="14" height="16" viewBox="0 0 14 18" fill="none" stroke="#00c8ff" strokeWidth="1.4">
                      <rect x="1" y="1" width="12" height="16" rx="2" />
                      <path d="M4 5h6M4 8h6M4 11h4" />
                    </svg>
                    <span>On-device Inventory App</span>
                  </div>
                  <div className="c72-chips">
                    <span className="c72-chip">Offline mode</span>
                    <span className="c72-chip">Auto-sync</span>
                    <span className="c72-chip">Barcode + UHF</span>
                  </div>
                </div>
                <div className="edge-card-foot">Android 11/13 · 1 W UHF · 8 000 mAh · IP65</div>
              </div>

            </div>
          </div>

          {/* ══ NETWORK PIPE ══ */}
          <SplitPipe />

          {/* ══ 3. MIDDLEWARE SERVER ══ */}
          <div className="sds-row row-server">
            <div className="row-aside aside-blue">
              <span className="row-aside-text">Server</span>
            </div>
            <div className="row-body">
              <div className="server-card">
                <div className="server-card-left">
                  <div className="server-icon-box">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.4">
                      <rect x="2" y="2" width="20" height="8" rx="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" />
                      <circle cx="19" cy="6" r="1.2" fill="#00c8ff" />
                      <circle cx="19" cy="18" r="1.2" fill="#00c8ff" />
                      <circle cx="16" cy="6" r="1.2" fill="#ff6820" />
                    </svg>
                  </div>
                  <div className="server-card-name">RFID Middleware Server</div>
                </div>
                <div className="server-capabilities">
                  {[
                    'Tag event filtering',
                    'Duplicate suppression',
                    'Zone & location logic',
                    'REST / MQTT broker',
                    'Reader health monitoring',
                    'Alert & threshold engine',
                    'Real-time dashboards',
                    'Audit logging',
                  ].map((cap) => (
                    <div key={cap} className="server-cap">{cap}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ API PIPE ══ */}
          <div className="api-pipe-row">
            <VerticalPipe
              color="blue"
              label="REST API · MQTT · WebSocket"
              packets={[
                { delay: 0,    dur: 2.0 },
                { delay: 0.65, dur: 2.0, color: '#ff6820' },
                { delay: 1.3,  dur: 2.0 },
              ]}
            />
          </div>

          {/* ══ 4. ENTERPRISE (bottom) ══ */}
          <div className="sds-row row-enterprise">
            <div className="row-aside aside-mixed">
              <span className="row-aside-text">Enterprise</span>
            </div>
            <div className="row-body ent-pair">

              <div className="ent-card ent-wms">
                <div className="ent-card-accent" style={{ background: '#ff6820' }} />
                <div className="ent-card-head">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6820" strokeWidth="1.6">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                  <span className="ent-card-name">WMS</span>
                </div>
                <div className="ent-card-full">Warehouse Management System</div>
                <ul className="ent-list">
                  <li>Inbound &amp; outbound flows</li>
                  <li>Pick, pack, and slotting</li>
                  <li>Location &amp; zone tracking</li>
                  <li>Stock count reconciliation</li>
                </ul>
              </div>

              <div className="ent-card ent-erp">
                <div className="ent-card-accent" style={{ background: '#00c8ff' }} />
                <div className="ent-card-head">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span className="ent-card-name">ERP</span>
                </div>
                <div className="ent-card-full">Enterprise Resource Planning</div>
                <ul className="ent-list">
                  <li>Inventory ledger &amp; valuation</li>
                  <li>Purchase order automation</li>
                  <li>Financial reconciliation</li>
                  <li>Supply chain integration</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        <div className="panel-actions is-visible sds-actions">
          <button type="button" className="next-button ghost" onClick={onBack}>
            Back: RFID Tags
          </button>
        </div>
      </div>
    </section>
  )
}
