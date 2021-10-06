export function randInt(maxVal: number, minVal: number = 0): number {
  return Math.floor(Math.random() * maxVal) + minVal;
}
