const FRAME_FILE_MATCH = /chainway_wireless_barcode_reader_360-(\d+)\.png$/

const frameModules = import.meta.glob(
  '../assets/chainway_wireless_barcode_reader_360-*.png',
  {
    eager: true,
    import: 'default',
  },
)

function getFrameNumber(path) {
  const match = path.match(FRAME_FILE_MATCH)
  return match ? Number(match[1]) : Number.NaN
}

export function getFrameManifest() {
  return Object.entries(frameModules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      sourceFrame: getFrameNumber(sourcePath),
    }))
    .filter((entry) => Number.isFinite(entry.sourceFrame))
    .sort((left, right) => left.sourceFrame - right.sourceFrame)
}
