import { useEffect, useMemo, useRef, useState } from 'react'
import { BackgroundFx } from './components/BackgroundFx'
import { AntennaPanel } from './components/AntennaPanel'
import { CategoryPanelSlider } from './components/CategoryPanelSlider'
import { SequenceStage } from './components/SequenceStage'
import { SpecCallouts } from './components/SpecCallouts'
import { TagsPanel } from './components/TagsPanel'
import { SystemDiagramSection } from './components/SystemDiagramSection'
import { Ura4SpecsPanel } from './components/Ura4SpecsPanel'
import { buildStorySections } from './data/specSections'
import {
  ANTENNA_SPECS,
  PAPER_LABEL_SPECS,
  TAG_SPECS,
  URA4_SLIDES,
} from './data/ura4AntennaSpecs'
import { useSmoothStoryProgress } from './hooks/useSmoothStoryProgress'
import {
  getAntennaManifest,
  getPaperLabelManifest,
  getTagManifest,
  getUra4Manifest,
} from './lib/extraAssetManifest'
import { getFrameManifest } from './lib/frameManifest'

const C72_END = 0.68
const URA4_END = 0.9
const URA4_SCROLL_DAMP = 0.042

function getRangeProgress(progress, start, end) {
  if (progress <= start) {
    return 0
  }

  if (progress >= end) {
    return 1
  }

  return (progress - start) / (end - start)
}

function App() {
  const storyRef = useRef(null)
  const c72Frames = useMemo(() => getFrameManifest(), [])
  const c72FrameUrls = useMemo(() => c72Frames.map((frame) => frame.url), [c72Frames])
  const c72Sections = useMemo(() => buildStorySections(c72Frames.length), [c72Frames.length])
  const ura4Frames = useMemo(() => getUra4Manifest(), [])
  const antennaFrames = useMemo(() => getAntennaManifest(), [])
  const tagFrames = useMemo(() => getTagManifest(), [])
  const paperLabelFrames = useMemo(() => getPaperLabelManifest(), [])
  const scrollProgress = useSmoothStoryProgress(storyRef)

  const [loadedCount, setLoadedCount] = useState(0)
  const [postC72Progress, setPostC72Progress] = useState(C72_END)
  const [manualStage, setManualStage] = useState(null)
  const [selectedAntenna, setSelectedAntenna] = useState(0)
  const [selectedTag, setSelectedTag] = useState(0)
  const [selectedPaperLabel, setSelectedPaperLabel] = useState(0)
  const postTargetRef = useRef(0)
  const postCurrentRef = useRef(0)

  postTargetRef.current = scrollProgress

  const allImageUrls = useMemo(
    () => [
      ...c72Frames.map((frame) => frame.url),
      ...ura4Frames.map((frame) => frame.url),
      ...antennaFrames.map((frame) => frame.url),
      ...tagFrames.map((frame) => frame.url),
      ...paperLabelFrames.map((frame) => frame.url),
    ],
    [c72Frames, ura4Frames, antennaFrames, tagFrames, paperLabelFrames],
  )

  useEffect(() => {
    if (!allImageUrls.length) {
      return
    }

    let disposed = false
    let count = 0
    setLoadedCount(0)

    allImageUrls.forEach((url) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = image.onerror = () => {
        if (disposed) {
          return
        }
        count += 1
        setLoadedCount(count)
      }
      image.src = url
    })

    return () => {
      disposed = true
    }
  }, [allImageUrls])

  useEffect(() => {
    let animationFrame = 0

    const animate = () => {
      const target = postTargetRef.current

      if (target <= C72_END) {
        postCurrentRef.current = target
      } else {
        const damp = URA4_SCROLL_DAMP
        postCurrentRef.current += (target - postCurrentRef.current) * damp

        if (Math.abs(target - postCurrentRef.current) < 0.00005) {
          postCurrentRef.current = target
        }
      }

      setPostC72Progress(postCurrentRef.current)
      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const preloadRatio = allImageUrls.length ? loadedCount / allImageUrls.length : 0
  const interactionReady = allImageUrls.length > 0 && loadedCount === allImageUrls.length
  const effectiveProgress = interactionReady ? scrollProgress : 0
  const timelineProgress =
    effectiveProgress <= C72_END ? effectiveProgress : Math.max(postC72Progress, C72_END)

  const scrollStage = timelineProgress < C72_END ? 'c72' : 'ura4'
  const storyStage = manualStage ?? scrollStage

  const c72Progress = getRangeProgress(timelineProgress, 0, C72_END)
  const ura4Progress = getRangeProgress(timelineProgress, C72_END, URA4_END)
  const scrollJourneyProgress = getRangeProgress(timelineProgress, 0, URA4_END)

  const c72FrameFloatIndex = (c72Frames.length - 1) * c72Progress
  const c72FrameIndex = c72Frames.length
    ? Math.max(0, Math.min(c72Frames.length - 1, Math.round(c72FrameFloatIndex)))
    : 0
  const c72FramePosition = c72FrameIndex + 1

  const ura4FrameIndex = ura4Frames.length
    ? Math.max(
        0,
        Math.min(ura4Frames.length - 1, Math.floor(ura4Progress * ura4Frames.length)),
      )
    : 0

  const ura4Slide = URA4_SLIDES[ura4FrameIndex] ?? URA4_SLIDES[0]
  const antennaItems = ANTENNA_SPECS.map((item) => ({
    ...item,
    url: antennaFrames.find((frame) => frame.gainDbi === item.gainDbi)?.url,
  }))
  const validAntennaItems = antennaItems.filter((item) => Boolean(item.url))
  const tagItems = TAG_SPECS.map((item) => ({
    ...item,
    url: tagFrames.find((frame) => frame.order === item.id)?.url,
  }))
  const validTagItems = tagItems.filter((item) => Boolean(item.url))
  const paperLabelItems = PAPER_LABEL_SPECS.map((item) => ({
    ...item,
    url: paperLabelFrames.find((frame) => frame.order === item.id)?.url,
  }))
  const validPaperLabelItems = paperLabelItems.filter((item) => Boolean(item.url))
  const isUra4LastFrame =
    storyStage === 'ura4' && ura4FrameIndex === Math.max(0, ura4Frames.length - 1)

  const activeSection =
    c72Sections.find(
      (section) =>
        c72FramePosition >= section.startFrame && c72FramePosition <= section.endFrame,
    ) ?? c72Sections[0]

  const sectionProgress = activeSection
    ? (c72FramePosition - activeSection.startFrame) / Math.max(activeSection.frameCount - 1, 1)
    : 0

  if (!c72Frames.length) {
    return (
      <main className="empty-state">
        <h1>C72 Sequence Not Found</h1>
        <p>
          Place sequence files in the project-level assets folder using the format
          chainway_wireless_barcode_reader_360-number.png.
        </p>
      </main>
    )
  }

  return (
    <div className="app-root">
      <BackgroundFx />

      <div id="content">
        <div className="app-shell">
          <header className="title-strip">
            <p className="eyebrow">Porta Nusa Indonesia</p>
            <h1>RFID and Barcode Solutions Porta Nusa Indonesia</h1>
            <p className="hero-subtitle">Present by Muhammad Agung Ferdiansyah</p>
          </header>

          <CategoryPanelSlider />

          <main className="story-wrap" ref={storyRef}>
            <section className="sticky-stage">
              <div className="ambient-layer" aria-hidden="true" />
              {storyStage === 'antenna' ? (
                <AntennaPanel
                  items={validAntennaItems}
                  activeIndex={selectedAntenna}
                  onSelect={setSelectedAntenna}
                  onBack={() => {
                    setManualStage(null)
                  }}
                  onNext={() => {
                    setSelectedTag(0)
                    setManualStage('tags')
                  }}
                  isReady={interactionReady}
                />
              ) : storyStage === 'tags' ? (
                <TagsPanel
                  items={validTagItems}
                  activeIndex={selectedTag}
                  onSelect={setSelectedTag}
                  onBack={() => {
                    setManualStage('antenna')
                  }}
                  onNext={() => {
                    setSelectedPaperLabel(0)
                    setManualStage('paper-label')
                  }}
                  isReady={interactionReady}
                  backLabel="Back: Antenna"
                  nextLabel="Next: Paper Label Tags"
                />
              ) : storyStage === 'paper-label' ? (
                <TagsPanel
                  items={validPaperLabelItems}
                  activeIndex={selectedPaperLabel}
                  onSelect={setSelectedPaperLabel}
                  onBack={() => {
                    setManualStage('tags')
                  }}
                  onNext={() => {
                    setManualStage('system')
                  }}
                  isReady={interactionReady}
                  title="Paper Label Tags"
                  subtitle="Click a paper label card to focus the selection and compare profiles."
                  backLabel="Back: Antimetal Tags"
                  nextLabel="Next: System Overview"
                />
              ) : storyStage === 'system' ? (
                <SystemDiagramSection
                  isReady={interactionReady}
                  onBack={() => {
                    setManualStage('paper-label')
                  }}
                />
              ) : (
                <div className="story-grid">
                  <div className="viewer-pane" aria-label="Product visual stage">
                    <SequenceStage
                      frameUrls={storyStage === 'c72' ? c72FrameUrls : ura4Frames.map((f) => f.url)}
                      frameIndex={storyStage === 'c72' ? c72FrameIndex : ura4FrameIndex}
                      progress={storyStage === 'c72' ? c72Progress : ura4Progress}
                    />

                    {!interactionReady && (
                      <div className="loading-scrim" role="status" aria-live="polite">
                        <h2>Loading All Frames</h2>
                        <p>
                          Preparing smooth playback... {loadedCount}/{allImageUrls.length}
                        </p>
                        <div className="progress-track" role="presentation">
                          <div
                            className="progress-fill"
                            style={{ width: `${preloadRatio * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="info-pane">
                    {storyStage === 'c72' ? (
                      <SpecCallouts
                        section={activeSection}
                        sectionProgress={sectionProgress}
                        isReady={interactionReady}
                      />
                    ) : (
                      <div className="info-stack">
                        <Ura4SpecsPanel slide={ura4Slide} isReady={interactionReady} />
                        {isUra4LastFrame && interactionReady && (
                          <div className="panel-actions is-visible">
                            <button
                              type="button"
                              className="next-button"
                              onClick={() => {
                                setSelectedAntenna(0)
                                setManualStage('antenna')
                              }}
                            >
                              Next: Antenna Comparison
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </aside>
                </div>
              )}

              {!manualStage && (
                <div className="scroll-hint">
                  <span>
                    {storyStage === 'c72' ? 'Scroll to rotate C72' : 'Continue to URA4 views'}
                  </span>
                  <div className="hint-line">
                    <div
                      className="hint-progress"
                      style={{ width: `${Math.max(4, scrollJourneyProgress * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
