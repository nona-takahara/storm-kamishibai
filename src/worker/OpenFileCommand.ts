import WorkerCommand from "./WorkerCommand";

const commandName = 'open-file';

export default class OpenFileCommand extends WorkerCommand {
  constructor(
    public u8Image: Uint8ClampedArray,
    public width: number,
    public height: number,
    public convertLut: boolean,
    public command = commandName
  ) { super(); }
  getTransfer() { return [this.u8Image.buffer]; }
  static is(data: WorkerCommand): data is OpenFileCommand { return data.command === commandName; }
}