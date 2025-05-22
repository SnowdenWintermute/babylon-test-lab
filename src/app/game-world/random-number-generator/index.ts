export class RandomNumberGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  private next(): number {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed;
  }

  // Returns a float in [min, max], inclusive
  public randBetween(min: number, max: number): number {
    if (min > max) {
      throw new Error("min must be less than or equal to max");
    }
    const rnd = this.next() / 0xffffffff;
    return min + rnd * (max - min);
  }
}
