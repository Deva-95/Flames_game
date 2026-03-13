export function cancelCommonLetters(name1, name2) {
  const a = name1.toLowerCase().replace(/[^a-z]/g, '').split('')
  const b = name2.toLowerCase().replace(/[^a-z]/g, '').split('')
  const aUsed = new Array(a.length).fill(false)
  const bUsed = new Array(b.length).fill(false)
  const cancelled = []

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (!bUsed[j] && !aUsed[i] && a[i] === b[j]) {
        aUsed[i] = true
        bUsed[j] = true
        cancelled.push(a[i])
        break
      }
    }
  }

  return {
    name1Letters: a,
    name2Letters: b,
    name1Used: aUsed,
    name2Used: bUsed,
    name1Remaining: a.filter((_, i) => !aUsed[i]),
    name2Remaining: b.filter((_, i) => !bUsed[i]),
    cancelled,
  }
}

export function runFlames(remainingCount) {
  if (remainingCount === 0) return { resultChar: null, steps: [] }

  const flames = ['F', 'L', 'A', 'M', 'E', 'S']
  let active = [...flames]
  const steps = []
  let index = 0

  while (active.length > 1) {
    index = (index + remainingCount - 1) % active.length
    steps.push({ eliminated: active[index], remaining: [...active], eliminatedIndex: index })
    active.splice(index, 1)
    if (index >= active.length) index = 0
  }

  return { resultChar: active[0], steps }
}

export const FLAMES_MEANINGS = {
  F: 'Friends',
  L: 'Love',
  A: 'Affection',
  M: 'Marriage',
  E: 'Enemies',
  S: 'Siblings',
}
