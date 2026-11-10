export function randInt(maxVal: number, minVal = 0): number {
  return Math.floor(Math.random() * maxVal) + minVal;
}
