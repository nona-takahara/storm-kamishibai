import Color from "../Color";
import IWorkerMessage from "../IWorkerMessage";

export default class ConvertedData implements IWorkerMessage {
  constructor(public convertedData: Uint32Array, public index: number, public layer: number, public color: Color) {}
  getTransfer(): Transferable[] {
      return [ this.convertedData.buffer ];
  }
}