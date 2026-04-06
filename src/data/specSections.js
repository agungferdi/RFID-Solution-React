const SECTION_BLUEPRINTS = [
  {
    id: 'physical-display',
    title: 'Physical + Display',
    weight: 8,
    summary:
      'Physical characteristics and display fundamentals for the first reveal segment.',
    panels: [
      {
        title: 'Physical Characteristics & Display',
        subtitle: 'Structure, dimensions, and interaction surface',
        specs: [
          'Host dimensions: 166.2 x 81.1 x 24.1 mm; with UHF handle: 177 x 88.6 x 145.8 mm',
          'Host weight: 375 g; with UHF handle: 654 g',
          "5.2-inch IPS LTPS display, 1920 x 1080 resolution",
          'Corning Gorilla Glass multi-touch supports gloves and wet hands',
        ],
        callouts: [
          {
            id: 'display',
            label: '5.2-inch FHD Display',
            text: 'IPS LTPS 1920 x 1080 panel with Gorilla Glass touch support.',
            align: 'right',
            x: 48,
            y: 32,
          },
          {
            id: 'ergonomic-body',
            label: 'Balanced Industrial Form',
            text: 'Host-only and pistol-grip form factors are optimized for long runs.',
            align: 'left',
            x: 58,
            y: 56,
          },
        ],
      },
    ],
  },
  {
    id: 'rfid-barcode-camera',
    title: 'RFID + Barcode + Camera',
    weight: 12,
    summary:
      'Split into two sub-panels to keep high-density capture and RFID capabilities readable.',
    panels: [
      {
        title: 'RFID Engine',
        subtitle: 'Long-range read performance and protocol support',
        specs: [
          'Impinj E Series chip architecture with Impinj Gen2X support',
          'EPC C1 GEN2 / ISO18000-6C with GS1 EPC Gen2v2 Authenticate',
          'Adjustable 1W (30 dBm), optional 2W for specific regions',
          '1300+ tags/sec and up to 30m max read range in low-interference conditions',
        ],
        callouts: [
          {
            id: 'antenna',
            label: 'Circular Polarized Antenna',
            text: 'Supports fast inventory throughput in dense tag environments.',
            align: 'left',
            x: 34,
            y: 36,
          },
          {
            id: 'uhf-power',
            label: 'Adjustable UHF Power',
            text: 'Fine-tune output from +5 dBm to +30 dBm for controlled coverage.',
            align: 'right',
            x: 62,
            y: 52,
          },
        ],
      },
      {
        title: 'Barcode + Camera',
        subtitle: 'Multi-symbology capture stack',
        specs: [
          '1D scanner option: Honeywell N4313',
          '2D imagers: Zebra SE4710/SE4750 series, Honeywell N6603, CM60',
          'Wide support for 1D and 2D symbologies including QR, DataMatrix, PDF417',
          '13MP autofocus camera with flash for visual capture workflows',
        ],
        callouts: [
          {
            id: 'barcode-head',
            label: 'Enterprise Scan Head',
            text: 'Optional Zebra and Honeywell engines for configurable scan workflows.',
            align: 'right',
            x: 52,
            y: 28,
          },
          {
            id: 'camera',
            label: '13MP Autofocus Camera',
            text: 'Frontline visual capture for documentation and proof tasks.',
            align: 'left',
            x: 44,
            y: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'os-sdk-performance',
    title: 'OS + SDK + Performance',
    weight: 20,
    summary:
      'Computing platform, connectivity stack, and user-environment resilience in one phase.',
    panels: [
      {
        title: 'Platform, SDK, and Communications',
        subtitle: 'Runtime stack and deployment footprint',
        specs: [
          'Android 11/13 with GMS, FOTA, Zero-Touch, Soti MobiControl, and SafeUEM support',
          'Chainway SDK for Java development on Eclipse or Android Studio',
          'Octa-core 2.3GHz CPU with 3GB+32GB / 4GB+64GB options',
          'Wi-Fi, Bluetooth, NFC, and WAN variants for field communications',
          'Operating environment: -20 C to 50 C, IP65 sealing, 1.5m drop spec',
        ],
        callouts: [
          {
            id: 'compute-core',
            label: 'Octa-Core 2.3GHz',
            text: 'Designed for sustained scanning, RFID reads, and app multitasking.',
            align: 'right',
            x: 60,
            y: 40,
          },
          {
            id: 'rugged-grade',
            label: 'Field-Grade Ruggedization',
            text: 'IP65 sealing and drop resistance for intensive daily operations.',
            align: 'left',
            x: 40,
            y: 62,
          },
        ],
      },
    ],
  },
  {
    id: 'ports-battery',
    title: 'Ports + Power + Remaining Physical',
    weight: 24,
    summary:
      'Final segment highlights charging I/O, battery capacity, and remaining physical details.',
    panels: [
      {
        title: 'Power, Type-C, and Expansion',
        subtitle: 'Remaining physical specifications and endurance profile',
        specs: [
          'Main battery: rechargeable 8000mAh Li-ion',
          'Continuous use: over 12 hours; standby: over 500 hours',
          'Charging time: about 3-4 hours with standard adapter and USB cable',
          'USB 2.0 Type-C interface with OTG support',
          'SIM/TF expansion slots and optional accessories for charging ergonomics',
        ],
        callouts: [
          {
            id: 'type-c',
            label: 'USB Type-C + OTG',
            text: 'Accessible interface for charging and wired peripheral operation.',
            align: 'right',
            x: 54,
            y: 72,
          },
          {
            id: 'battery',
            label: '8000mAh Battery',
            text: 'Extended endurance engineered for long inventory and scan shifts.',
            align: 'left',
            x: 45,
            y: 46,
          },
        ],
      },
    ],
  },
]

function buildCounts(totalFrames, weights) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const exact = weights.map((weight) => (weight / totalWeight) * totalFrames)
  const counts = exact.map((value) => Math.floor(value))
  let remainder = totalFrames - counts.reduce((sum, count) => sum + count, 0)

  const byFraction = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((left, right) => right.fraction - left.fraction)

  let pointer = 0
  while (remainder > 0) {
    counts[byFraction[pointer].index] += 1
    remainder -= 1
    pointer = (pointer + 1) % byFraction.length
  }

  return counts
}

export function buildStorySections(totalFrames) {
  if (!totalFrames) {
    return []
  }

  const counts = buildCounts(
    totalFrames,
    SECTION_BLUEPRINTS.map((section) => section.weight),
  )

  let cursor = 1

  return SECTION_BLUEPRINTS.map((section, sectionIndex) => {
    const frameCount = counts[sectionIndex]
    const startFrame = cursor
    const endFrame = cursor + frameCount - 1
    cursor += frameCount

    return {
      ...section,
      frameCount,
      startFrame,
      endFrame,
    }
  })
}
