function getPanelForProgress(section, sectionProgress) {
  if (!section || !section.panels?.length) {
    return null
  }

  if (section.panels.length === 1) {
    return section.panels[0]
  }

  const panelIndex = sectionProgress >= 0.5 ? 1 : 0
  return section.panels[panelIndex]
}

export function SpecCallouts({ section, sectionProgress, isReady }) {
  const panel = getPanelForProgress(section, sectionProgress)

  if (!section || !panel) {
    return null
  }

  return (
    <section className={`info-content ${isReady ? 'is-visible' : ''}`}>
      <p className="section-label">Specifications</p>
      <h2>{panel.title}</h2>
      <p className="section-subtitle">{panel.subtitle}</p>

      <ul className="spec-list">
        {panel.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
    </section>
  )
}
