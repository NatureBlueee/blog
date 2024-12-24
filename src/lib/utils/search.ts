import pinyin from 'pinyin'

interface SearchIndex {
  original: string
  pinyin: string
  firstLetters: string
  segments: string[]
}

export function createSearchIndex(text: string): SearchIndex {
  const pinyinResult = pinyin(text, {
    style: pinyin.STYLE_NORMAL,
    heteronym: true,
  })

  const segments = text
    .toLowerCase()
    .split(/[\s,.!?，。！？、]/g)
    .filter(Boolean)

  return {
    original: text.toLowerCase(),
    pinyin: pinyinResult.map((p) => p[0]).join(''),
    firstLetters: pinyinResult.map((p) => p[0][0]).join(''),
    segments,
  }
}

export function searchMatch(index: SearchIndex, query: string): boolean {
  const q = query.toLowerCase()

  const segmentMatch = index.segments.some(
    (segment) =>
      segment.includes(q) || pinyin(segment, { style: pinyin.STYLE_NORMAL }).join('').includes(q)
  )

  return (
    index.original.includes(q) ||
    index.pinyin.includes(q) ||
    index.firstLetters.includes(q) ||
    segmentMatch
  )
}
