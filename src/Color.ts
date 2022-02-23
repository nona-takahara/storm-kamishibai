import Lut from "./Lut";

export default class Color {
  readonly originalR: number;
  readonly originalG: number;
  readonly originalB: number;
  readonly originalA: number | undefined;
  readonly raw: number | undefined;
  convertedR: number;
  convertedG: number;
  convertedB: number;

  constructor(r: number, g: number, b: number, a: number | undefined = undefined, raw: number | undefined = undefined) {
    this.originalR = r;
    this.originalG = g;
    this.originalB = b;
    this.originalA = a;
    this.raw = raw;

    let k = Lut.map((v) => v);
    k[256] = 256;
    
    this.convertedR = Math.max(0, k.findIndex((v) => r < v) - 1);
    this.convertedG = Math.max(0, k.findIndex((v) => g < v) - 1);
    this.convertedB = Math.max(0, k.findIndex((v) => b < v) - 1);
  }

  setConvertedRGB(v: string) {
    if (v.length == 7) {
      this.convertedR = parseInt(v.substring(1, 3), 16);
      this.convertedG = parseInt(v.substring(3, 5), 16);
      this.convertedB = parseInt(v.substring(5, 7), 16);
    }
  }
}
