import { useState } from 'react'
import c66Image from '../assets/panel/c66.png'
import cp30Image from '../assets/panel/cp30.png'
import mc51Image from '../assets/panel/mc51.png'
import p100Image from '../assets/panel/p100.png'
import r5Image from '../assets/panel/r5.png'
import ura4Image from '../assets/URA4/ura4_1.png'

const PANEL_SLIDES = [
  {
    id: 'mc51',
    category: 'Handheld RFID Reader',
    product: 'MC51',
    image: mc51Image,
    description:
      'MC51 is built for handheld inventory cycles with stable UHF reading, ergonomic handling, and fast response in warehouse and retail operations.',
  },
  {
    id: 'c66',
    category: 'Mobile Computers',
    product: 'C66',
    image: c66Image,
    description:
      'C66 combines mobile computing and enterprise data capture for field teams that need barcode scanning, app workflows, and durable daily usage.',
  },
  {
    id: 'ura4',
    category: 'Fixed Reader',
    product: 'URA4',
    image: ura4Image,
    description:
      'URA4 enables fixed-position RFID monitoring with multi-antenna support, making it suitable for gate control, production checkpoints, and automated tracking.',
  },
  {
    id: 'p100',
    category: 'Industrial Tablet',
    product: 'P100',
    image: p100Image,
    description:
      'P100 provides rugged tablet performance for operations that require a larger interface, reliable connectivity, and strong resistance in industrial environments.',
  },
  {
    id: 'r5',
    category: 'Wearable RFID Readers',
    product: 'R5',
    image: r5Image,
    description:
      'R5 is optimized for hands-free RFID workflows, helping operators move faster with lower fatigue during repetitive picking and verification tasks.',
  },
  {
    id: 'cp30',
    category: 'Printer',
    product: 'CP30',
    image: cp30Image,
    description:
      'CP30 supports efficient label printing with practical portability and reliable output quality for traceability and on-site identification workflows.',
  },
]

export function CategoryPanelSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeSlide = PANEL_SLIDES[activeIndex]

  const goPrev = () => {
    setActiveIndex((current) =>
      current === 0 ? PANEL_SLIDES.length - 1 : current - 1,
    )
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % PANEL_SLIDES.length)
  }

  return (
    <section className="category-slider" aria-label="Product category panel slider">
      <div className="category-slider-head">
        <h2 className="category-slider-title">Featured Product Categories</h2>
        <div className="category-slider-controls">
          <button
            type="button"
            className="slider-arrow"
            onClick={goPrev}
            aria-label="Previous category"
          >
            {'<'}
          </button>
          <button
            type="button"
            className="slider-arrow"
            onClick={goNext}
            aria-label="Next category"
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className="category-slider-main">
        <div className="category-image-wrap">
          <img
            src={activeSlide.image}
            alt={`${activeSlide.product} ${activeSlide.category}`}
            className="category-main-image"
            loading="eager"
          />

          <article className="category-float-card" aria-label="Selected product details">
            <p className="section-label category-float-label">Category Spotlight</p>
            <h3>{activeSlide.category}</h3>
            <p className="category-float-product">{activeSlide.product}</p>
            <p className="category-description">{activeSlide.description}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
