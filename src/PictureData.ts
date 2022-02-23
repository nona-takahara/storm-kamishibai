import Color from "./Color";

export default class PictureData {
  readonly data: Uint32Array;
  readonly width: number;
  readonly height: number;
  readonly colorSet: Array<Color>;

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    let rdata = new Uint32Array(data.buffer);
    this.width = width;
    this.height = height;
    
    let cl = new Array<Color>();
    let cs32 = Uint32Array.from(new Set(rdata)).reverse();
    let cs = new Uint8ClampedArray(cs32.buffer);
    for (let i = 0; i < cs.length; i += 4) {
      cl.push(new Color(cs[i], cs[i+1], cs[i+2], cs[i+3], cs32[i / 4]));
    }

    this.colorSet = cl;
    this.data = rdata.map((v) => cs32.indexOf(v));
  }

  setConvertedRGB(i: number, v: string) {
    this.colorSet[i].setConvertedRGB(v);
  }
}