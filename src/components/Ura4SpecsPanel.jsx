export function Ura4SpecsPanel({ slide, isReady }) {
  if (!slide) {
    return null
  }

  return (
    <section className={`info-content ${isReady ? 'is-visible' : ''}`}>
      <p className="section-label">URA4 Specifications</p>
      <h2>{slide.title}</h2>
      <p className="section-subtitle">{slide.subtitle}</p>

      <ul className="spec-list">
        {slide.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
    </section>
  )
}
