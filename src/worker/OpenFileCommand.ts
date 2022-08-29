import WorkerCommand from "./WorkerCommand";

export default class OpenFileCommand extends WorkerCommand {
  constructor(
    public u8Image: Uint8ClampedArray,
    public width: number,
    public height: number,
    public convertLut: boolean
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, [this.u8Image.buffer]);
  }
}