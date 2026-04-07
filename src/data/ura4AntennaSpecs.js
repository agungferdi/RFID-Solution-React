export const URA4_SLIDES = [
  {
    id: 'ura4-rfid',
    title: 'URA4 RFID Core + 4 Antenna Ports',
    subtitle: 'Frame 1 focus',
    specs: [
      'Impinj E Series with Impinj Gen2X for enhanced UHF capability',
      'Fastest read rate up to 1300+ tags/sec in optimized environments',
      '4-channel 50 ohm TNC antenna ports with antenna detection support',
      'Engineered for fixed deployments in warehouse, retail, and production flow',
    ],
  },
  {
    id: 'ura4-physical',
    title: 'URA4 Physical Characteristics',
    subtitle: 'Frame 2 focus',
    specs: [
      'Dimensions: 214 x 148 x 30 mm',
      'Weight: about 1000 g (without antenna)',
      'Durable aluminium alloy enclosure with air-cooling architecture',
      'Power options: DC 12V, PoE 802.3af (13W), PoE+ 802.3at (25.5W)',
    ],
  },
  {
    id: 'ura4-os-sdk',
    title: 'Android 13 + SDK + Performance',
    subtitle: 'Frame 3 focus',
    specs: [
      'Operating system: Android 13',
      'SDK: Chainway Software Development Kit',
      'Language/tooling: Java with Eclipse or Android Studio',
      'CPU and memory: Octa-core 2.0GHz, 3GB RAM + 32GB ROM',
    ],
  },
  {
    id: 'ura4-interfaces',
    title: 'Interfaces and Communications',
    subtitle: 'Frame 4 focus',
    specs: [
      'Ports: RS232, RJ45, HDMI, USB Type-C, and USB Type-A expansion',
      'Industrial I/O: GPIO with optical isolation for input and output',
      'Wireless stack: Wi-Fi, 4G WWAN variants, and Bluetooth 5.1',
      'Designed for flexible deployment and integration in connected systems',
    ],
  },
]

export const ANTENNA_SPECS = [
  {
    gainDbi: 5,
    model: 'Ant-RC05 5dBi Panel Antenna',
    summary:
      'Portable compact antenna for moderate-range multi-tag reads with stable performance.',
    bullets: [
      '5 dBi gain, RHCP polarization, and up to 80/70 degree beam profile',
      'IP67 protection with lightweight body for easy installation',
      'Typical fit: logistics, warehousing, access control, material handling',
    ],
  },
  {
    gainDbi: 9,
    model: 'Ant-RC09 9dBi Panel Antenna',
    summary:
      'Balanced long-distance and bulk-tag reading with efficient deployment footprint.',
    bullets: [
      '9 dBi gain with 60/55 degree beam-width profile',
      'IP67-rated rugged design for demanding environments',
      'Typical fit: retail, transportation, electricity, and access control',
    ],
  },
  {
    gainDbi: 12,
    model: 'Ant-RC12 12dBi Panel Antenna',
    summary:
      'High-gain antenna tuned for longer-range reads and denser fixed-reader scenarios.',
    bullets: [
      '12 dBi gain with tighter 40/38 degree beam-width profile',
      'IP67 and robust mounting options for outdoor/industrial deployment',
      'Typical fit: ITS, event flows, warehousing, and equipment management',
    ],
  },
]

export const TAG_SPECS = [
  {
    id: 1,
    model: 'PORTA-F7030T Flexible Anti-metal Tag',
    summary: 'Thin flexible on-metal label for industrial surfaces and curved assets.',
    bullets: [
      '70 x 30 x 0.6 mm with EPC C1 Gen2 / ISO 18000-6C compliance',
      'Impinj M730, EPC 128 bits and TID 96 bits',
      'About 10 m read range (US standard, handheld 1W)',
    ],
  },
  {
    id: 2,
    model: 'PORTA-ABS10533UA ABS Anti-Metal Tag',
    summary: 'Longer-range rigid ABS housing for fixed and portable on-metal workflows.',
    bullets: [
      '105 x 33.5 x 10.5 mm, ABS shell with screw/rivet installation',
      'NXP UCODE 9xm with extended EPC/User memory profile',
      'Up to 15 m read range and IP67 sealing',
    ],
  },
  {
    id: 3,
    model: 'PORTA-ABS7931UA ABS Anti-Metal Tag',
    summary: 'Compact ABS anti-metal tag tuned for balanced range and rugged mounting.',
    bullets: [
      '79 x 31 x 8 mm body, adhesive/screw/rivet mounting support',
      'NXP UCODE 8, EPC 128 bits and TID 96 bits',
      'About 8 m read range with IP67 protection',
    ],
  },
  {
    id: 4,
    model: 'PORTA-F9522 Flexible Anti-metal Tag',
    summary: 'Flexible on-metal tag profile for retail and logistics tracking workflows.',
    bullets: [
      '95 x 22 x 1 mm dimensions with bright PET base and glassine liner',
      'NXP UCODE 8 with EPC Global Class 1 Gen2 / ISO 18000-6C and EPC 128-bit memory',
      'About 10 m read range (US handheld 1W), operating temperature -20 C to 80 C',
    ],
  },
  {
    id: 5,
    model: 'PORTA-PCB9525UA PCB Anti-Metal Tag',
    summary: 'FR4 PCB anti-metal tag for durable industrial and equipment identification.',
    bullets: [
      '95 x 25 x 3.5 mm PCB structure with adhesive or screw mounting',
      'NXP UCODE 8, EPC 128 bits and TID 96 bits',
      'About 5 m read range and IP68 sealing level',
    ],
  },
  {
    id: 6,
    model: 'PORTA-UCT8554 UHF Card Tag',
    summary: 'UHF PVC card tag format for non-metal assets and card-based workflows.',
    bullets: [
      '85.5 x 54 x 1 mm card form factor',
      'Impinj M730, EPC 128 bits and unique TID 96 bits',
      'More than 15 m read range in US standard handheld tests',
    ],
  },
]

export const PAPER_LABEL_SPECS = [
  {
    id: 1,
    model: 'PORTA EOS-430 M830 Paper Label',
    summary: 'Narrow paper label profile for apparel and item-level retail tagging.',
    bullets: [
      'Antenna size 70 x 8 mm with 74 x 12 mm die-cut finish size',
      'Impinj M830 IC with EPC Class 1 Gen2 / ISO 18000-63 and EPC 128-bit memory',
      'UHF global 860-960 MHz operating band with -40 C to +85 C temperature range',
    ],
  },
  {
    id: 2,
    model: 'PORTA EOS-241 M730 Paper Label',
    summary: 'Compact wet inlay format for inventory visibility and supply-chain labeling.',
    bullets: [
      'Antenna size 42 x 16 mm with 44 x 18 mm die-cut finish size',
      'Impinj M730 IC with EPC Class 1 Gen2 / ISO 18000-63 and EPC 128-bit memory',
      'UHF global 860-960 MHz, non-metal application, -40 C to +85 C operating range',
    ],
  },
  {
    id: 3,
    model: 'PORTA EOS-261 M730 Paper Label',
    summary: 'Balanced paper sticker design for item-level tagging across logistics flows.',
    bullets: [
      'Antenna size 44 x 20 mm with 47 x 25 mm die-cut finish size',
      'Impinj M730 IC with EPC Class 1 Gen2 / ISO 18000-63 and EPC 128-bit memory',
      'UHF global 860-960 MHz, non-metal application, -40 C to +85 C operating range',
    ],
  },
  {
    id: 4,
    model: 'PORTA-V90M UHF RFID Label',
    summary: 'Long-format coated-paper label for retail and logistics non-metal surfaces.',
    bullets: [
      'Tag size 96 x 22 mm with 90 x 20 mm antenna size',
      'Impinj M700 series IC with EPC Global Class 1 Gen2 / ISO 18000-6C protocol',
      'Read range >= 10 m (US standard handheld 1W), operating temperature -20 C to 80 C',
    ],
  },
]
