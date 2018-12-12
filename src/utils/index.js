import * as R from 'ramda'

export const half = R.divide(R.__, 2)

export const arrayOfN = x => Array.from(Array(x))

export const indexMap = R.addIndex(R.map)

export const zeroIndexArrayOfLength = R.compose(
  indexMap((x, i) => i),
  arrayOfN
)

export const min = x => Math.min(...x)

export const minusTwo = R.subtract(R.__, 2)
