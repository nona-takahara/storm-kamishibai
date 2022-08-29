import IWorkerMessage from "../IWorkerMessage";

export default class OpenFileCommand implements IWorkerMessage {
  constructor(
    public u8Image: Uint8ClampedArray,
    public width: number,
    public height: number,
    public convertLut: boolean
  ) { }
  getTransfer() { return [this.u8Image.buffer]; }
}