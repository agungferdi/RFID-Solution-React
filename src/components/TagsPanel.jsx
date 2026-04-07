export function TagsPanel({
  items,
  activeIndex,
  onSelect,
  onBack,
  onNext,
  isReady,
  sectionLabel = 'RFID Tag Catalog',
  title = 'Antimetal Tags',
  subtitle = 'Click a tag card to focus the selection and compare form factors.',
  backLabel = 'Back: Antenna',
  nextLabel = 'Next: System Overview',
}) {
  if (!items?.length) {
    return null
  }

  return (
    <section className={`antenna-panel ${isReady ? 'is-visible' : ''}`}>
      <header className="antenna-header">
        <p className="section-label">{sectionLabel}</p>
        <h2>{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </header>

      <div className="antenna-grid tags-grid">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.id}
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
          {backLabel}
        </button>
        <button type="button" className="next-button" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </section>
  )
}
