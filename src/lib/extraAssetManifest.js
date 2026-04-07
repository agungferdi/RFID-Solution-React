const URA4_FILE_MATCH = /ura4_(\d+)\.png$/
const ANTENNA_FILE_MATCH = /antenna_(\d+)db\.png$/
const TAG_FILE_MATCH = /tag_(\d+)\.(?:png|jpe?g|webp)$/i

const ura4Modules = import.meta.glob('../assets/URA4/ura4_*.png', {
  eager: true,
  import: 'default',
})

const antennaModules = import.meta.glob('../assets/URA4/antenna_*db.png', {
  eager: true,
  import: 'default',
})

const tagModules = import.meta.glob('../assets/tags/tag_*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const paperLabelModules = import.meta.glob('../assets/paper_label/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

function getNumericSuffix(path, matcher) {
  const match = path.match(matcher)
  return match ? Number(match[1]) : Number.NaN
}

function getPaperLabelOrder(path) {
  const normalized = path.toLowerCase()

  if (normalized.includes('eos430')) {
    return 1
  }

  if (normalized.includes('eos241')) {
    return 2
  }

  if (normalized.includes('eos-261') || normalized.includes('eos261')) {
    return 3
  }

  if (normalized.includes('v90m')) {
    return 4
  }

  return Number.NaN
}

export function getUra4Manifest() {
  return Object.entries(ura4Modules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      order: getNumericSuffix(sourcePath, URA4_FILE_MATCH),
    }))
    .filter((entry) => Number.isFinite(entry.order))
    .sort((left, right) => left.order - right.order)
}

export function getAntennaManifest() {
  return Object.entries(antennaModules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      gainDbi: getNumericSuffix(sourcePath, ANTENNA_FILE_MATCH),
    }))
    .filter((entry) => Number.isFinite(entry.gainDbi))
    .sort((left, right) => left.gainDbi - right.gainDbi)
}

export function getTagManifest() {
  return Object.entries(tagModules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      order: getNumericSuffix(sourcePath, TAG_FILE_MATCH),
    }))
    .filter((entry) => Number.isFinite(entry.order))
    .sort((left, right) => left.order - right.order)
}

export function getPaperLabelManifest() {
  return Object.entries(paperLabelModules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      order: getPaperLabelOrder(sourcePath),
    }))
    .filter((entry) => Number.isFinite(entry.order))
    .sort((left, right) => left.order - right.order)
}
