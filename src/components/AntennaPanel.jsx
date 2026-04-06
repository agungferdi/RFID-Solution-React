export function AntennaPanel({ items, activeIndex, onSelect, onBack, onNext, isReady }) {
  if (!items?.length) {
    return null
  }

  return (
    <section className={`antenna-panel ${isReady ? 'is-visible' : ''}`}>
      <header className="antenna-header">
        <p className="section-label">Antenna Comparison</p>
        <h2>5 dBi, 9 dBi, and 12 dBi Options</h2>
        <p className="section-subtitle">
          Click an antenna card to select and compare its profile.
        </p>
      </header>

      <div className="antenna-grid">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.gainDbi}
            className={`antenna-card ${index === activeIndex ? 'active' : ''}`}
            onClick={() => onSelect?.(index)}
          >
            <img src={item.url} alt={item.model} loading="eager" />
            <h3>{item.model}</h3>
            <p>{item.summary}</p>
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="panel-actions is-visible">
        <button type="button" className="next-button ghost" onClick={onBack}>
          Back: URA4
        </button>
        <button type="button" className="next-button" onClick={onNext}>
          Next: RFID Tags
        </button>
      </div>
    </section>
  )
}
