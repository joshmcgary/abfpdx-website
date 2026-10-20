import { describe, expect, it } from 'vitest'
import { beliefs, beliefSources } from './content.js'

describe('belief summary mapping', () => {
  it('maps every selectable summary to its intended complete statement', () => {
    const sourcesByKey = new Map(beliefSources.map((source) => [source.key, source]))
    const selectedHeadings = beliefs.map((belief) => sourcesByKey.get(belief.key)?.title)

    expect(selectedHeadings).toEqual([
      'Jesus Christ, Lord and Messiah',
      'The Triune God',
      'Baptism',
      'Holy Scripture',
      'Humanity and Sin',
      'Salvation by Grace Through Faith',
    ])
    expect(new Set(beliefs.map((belief) => belief.key)).size).toBe(beliefs.length)
    expect(new Set(beliefSources.map((source) => source.key)).size).toBe(beliefSources.length)
  })
})
