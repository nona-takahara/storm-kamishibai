import Color from "./Color";
import LuaCodeOption from "./LuaCodeOption";

export default class {
  readonly layers = new Array<string>();
  constructor(private option: LuaCodeOption) { }

  push(convertedData: Uint32Array, color: Color, layer: number) {
    if (convertedData.length > 3) {
      let s = `C(${color.convertedR},${color.convertedG},${color.convertedB})`;
      for (let i = 0; i < convertedData.length; i += 4) {
        if (convertedData[i + 2] == 1 && this.option.compressV) {
          s += `V(${convertedData[i]},${convertedData[i + 1]},${convertedData[i + 3]})`
        } else if (convertedData[i + 3] == 1 && this.option.compressH) {
          s += `H(${convertedData[i]},${convertedData[i + 1]},${convertedData[i + 2]})`
        } else {
          s += `R(${convertedData[i]},${convertedData[i + 1]},${convertedData[i + 2]},${convertedData[i + 3]})`
        }
      }
      this.layers[layer] = s;
    }
  }
}