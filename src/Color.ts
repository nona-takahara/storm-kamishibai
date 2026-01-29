import Lut from "./Lut";
import colorParse from 'parse-css-color';

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

    const k = Lut.map((v) => v);
    k[256] = 256;
    
    this.convertedR = Math.max(0, k.findIndex((v) => r < v) - 1);
    this.convertedG = Math.max(0, k.findIndex((v) => g < v) - 1);
    this.convertedB = Math.max(0, k.findIndex((v) => b < v) - 1);
  }

  setConvertedRGB(v: string) {
    const parsed = colorParse(v);
    if (parsed && parsed.type === 'rgb') {
      this.convertedR = parsed.values[0];
      this.convertedG = parsed.values[1];
      this.convertedB = parsed.values[2];
    }
  }
}
