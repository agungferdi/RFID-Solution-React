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

const tagModules = import.meta.glob('../assets/tags/*.{png,jpg,jpeg,webp}', {
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

function getTagOrder(path) {
  const normalized = path.toLowerCase()

  if (normalized.includes('f9522')) {
    return 4
  }

  return getNumericSuffix(path, TAG_FILE_MATCH)
}

function getTagPriority(path) {
  return path.toLowerCase().includes('f9522') ? 0 : 1
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
  const sorted = Object.entries(tagModules)
    .map(([sourcePath, url]) => ({
      sourcePath,
      url,
      order: getTagOrder(sourcePath),
      priority: getTagPriority(sourcePath),
    }))
    .filter((entry) => Number.isFinite(entry.order))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order
      }

      if (left.priority !== right.priority) {
        return left.priority - right.priority
      }

      return left.sourcePath.localeCompare(right.sourcePath)
    })

  const uniqueByOrder = new Map()

  sorted.forEach((entry) => {
    if (!uniqueByOrder.has(entry.order)) {
      uniqueByOrder.set(entry.order, {
        sourcePath: entry.sourcePath,
        url: entry.url,
        order: entry.order,
      })
    }
  })

  return Array.from(uniqueByOrder.values())
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
