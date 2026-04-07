function FlowDots({ count = 4, direction = 'up', color = '#00c8ff', delay = 0 }) {
  return (
    <div className={`flow-dots flow-${direction}`} style={{ '--dot-color': color }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flow-dot" style={{ animationDelay: `${delay + i * 0.42}s` }} />
      ))}
    </div>
  )
}

function RfRings({ side }) {
  return (
    <div className={`rf-rings rf-rings-${side}`}>
      <div className="rf-ring" style={{ animationDelay: '0s' }} />
      <div className="rf-ring" style={{ animationDelay: '0.55s' }} />
      <div className="rf-ring" style={{ animationDelay: '1.1s' }} />
    </div>
  )
}

export function SystemDiagramSection({ isReady, onBack }) {
  return (
    <section className={`sds-root ${isReady ? 'is-visible' : ''}`}>
      <div className="sds-inner">
        <header className="sds-header">
          <p className="section-label">End-to-End Architecture</p>
          <h2>Complete RFID Inventory Management System</h2>
          <p className="section-subtitle">
            UHF radio interrogates passive tags · readers stream events over LAN or Wi-Fi to a
            central server · WMS, ERP, and inventory platforms consume real-time data
          </p>
        </header>

        <div className="sds-canvas">

          {/* ── LAYER 1: ENTERPRISE ── */}
          <div className="sds-layer layer-enterprise">
            <div className="sds-layer-badge">Enterprise Systems</div>
            <div className="ent-row">
              <div className="ent-node" style={{ '--nc': '#ff6820' }}>
                <div className="ent-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="ent-name">WMS</div>
                <div className="ent-sub">Warehouse Management</div>
                <ul className="ent-bullets">
                  <li>Inbound &amp; Outbound</li>
                  <li>Pick · Pack · Slotting</li>
                  <li>Location Tracking</li>
                </ul>
              </div>

              <div className="ent-node" style={{ '--nc': '#00c8ff' }}>
                <div className="ent-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="ent-name">ERP</div>
                <div className="ent-sub">Enterprise Resource Planning</div>
                <ul className="ent-bullets">
                  <li>Inventory Ledger</li>
                  <li>Purchase Orders</li>
                  <li>Financial Reconciliation</li>
                </ul>
              </div>

              <div className="ent-node" style={{ '--nc': '#35b39a' }}>
                <div className="ent-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 3h18v18H3z" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div className="ent-name">Inventory Backend</div>
                <div className="ent-sub">Asset &amp; Stock Database</div>
                <ul className="ent-bullets">
                  <li>Real-time Stock Levels</li>
                  <li>Audit Trail &amp; History</li>
                  <li>Analytics Dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── BRIDGE A: REST / MQTT ── */}
          <div className="sds-bridge bridge-api">
            <div className="bridge-line">
              <FlowDots count={5} color="#00c8ff" delay={0} direction="up" />
              <FlowDots count={5} color="#ff6820" delay={0.7} direction="down" />
            </div>
            <div className="bridge-label">REST API · MQTT · WebSocket</div>
          </div>

          {/* ── LAYER 2: MIDDLEWARE SERVER ── */}
          <div className="sds-layer layer-server">
            <div className="sds-layer-badge">Middleware &amp; Server</div>
            <div className="server-node">
              <div className="server-glyph">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <circle cx="6" cy="6" r="1" fill="#00c8ff" />
                  <circle cx="6" cy="18" r="1" fill="#00c8ff" />
                </svg>
              </div>
              <div className="server-body">
                <div className="server-title">RFID Middleware &amp; Application Server</div>
                <div className="server-pills">
                  <span className="srv-pill">Event Filtering</span>
                  <span className="srv-pill">Tag Deduplication</span>
                  <span className="srv-pill">Business Logic</span>
                  <span className="srv-pill">REST / MQTT Broker</span>
                  <span className="srv-pill">Reader Management</span>
                  <span className="srv-pill">Alert Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BRIDGE B: LAN vs WIFI SPLIT ── */}
          <div className="sds-bridge bridge-net">
            <div className="net-split">
              <div className="net-branch">
                <div className="net-line net-line-lan">
                  <FlowDots count={3} color="#ff6820" delay={0.1} direction="down" />
                </div>
                <div className="net-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  LAN / PoE · RJ45
                </div>
              </div>

              <div className="net-divider" />

              <div className="net-branch">
                <div className="net-line net-line-wifi">
                  <FlowDots count={3} color="#00c8ff" delay={0.4} direction="down" />
                </div>
                <div className="net-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1" fill="currentColor" />
                  </svg>
                  Wi-Fi 802.11ac
                </div>
              </div>
            </div>
          </div>

          {/* ── LAYER 3: EDGE READERS ── */}
          <div className="sds-layer layer-edge">
            <div className="sds-layer-badge">Edge Readers</div>
            <div className="edge-row">

              {/* URA4 block */}
              <div className="edge-block ura4-block">
                <div className="edge-block-head">
                  <span className="edge-dot dot-orange" />
                  <span className="edge-block-name">URA4 Fixed Reader</span>
                </div>
                <div className="edge-block-sub">Android 13 · Impinj E Series · PoE/DC 12V</div>
                <div className="ant-strip">
                  <div className="ant-slot active-slot">
                    <div className="ant-icon">◢</div>
                    <div className="ant-label">5 dBi</div>
                  </div>
                  <div className="ant-slot active-slot">
                    <div className="ant-icon">◢</div>
                    <div className="ant-label">9 dBi</div>
                  </div>
                  <div className="ant-slot active-slot">
                    <div className="ant-icon">◢</div>
                    <div className="ant-label">12 dBi</div>
                  </div>
                  <div className="ant-slot">
                    <div className="ant-icon">◢</div>
                    <div className="ant-label">Port 4</div>
                  </div>
                </div>
                <div className="edge-block-note">4-channel TNC ports · Up to 30 m range</div>
              </div>

              {/* C72 block */}
              <div className="edge-block c72-block">
                <div className="edge-block-head">
                  <span className="edge-dot dot-blue" />
                  <span className="edge-block-name">C72 Handheld Reader</span>
                </div>
                <div className="edge-block-sub">Android 11/13 · 1W UHF · 8000 mAh</div>
                <div className="c72-app-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M9 7h6M9 11h6M9 15h4" />
                  </svg>
                  On-device Inventory App
                </div>
                <div className="c72-conn-row">
                  <span className="c72-conn-chip">Offline-capable</span>
                  <span className="c72-conn-chip">Auto-sync</span>
                  <span className="c72-conn-chip">Barcode + RFID</span>
                </div>
                <div className="edge-block-note">Reads up to 1300+ tags/sec · 30 m range</div>
              </div>

            </div>
          </div>

          {/* ── BRIDGE C: UHF RF ── */}
          <div className="sds-bridge bridge-rf">
            <RfRings side="left" />
            <div className="rf-center-label">
              <div className="rf-freq-badge">UHF · 860 – 960 MHz</div>
              <div className="rf-proto-line">EPC C1 Gen2 / ISO 18000-6C · LLRP Protocol</div>
            </div>
            <RfRings side="right" />
          </div>

          {/* ── LAYER 4: RFID TAGS ── */}
          <div className="sds-layer layer-tags">
            <div className="sds-layer-badge">RFID Tags (Passive)</div>
            <div className="tag-row">
              <div className="tag-chip">Flexible Anti-metal</div>
              <div className="tag-chip">ABS Hard Tag</div>
              <div className="tag-chip">PCB Tag</div>
              <div className="tag-chip">UHF Card</div>
              <div className="tag-chip tag-chip-dim">+ Custom Inlays</div>
            </div>
            <div className="tag-note">Passive · No battery · Backscatter response · EPC 128-bit unique ID</div>
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
