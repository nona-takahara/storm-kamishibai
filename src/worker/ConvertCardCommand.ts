import LuaCodeOption from "../LuaCodeOption";
import WorkerCommand from "./WorkerCommand";

export default class ConvertCardCommand extends WorkerCommand {
  constructor(
    public picture: Uint32Array, 
    public width: number,
    public height: number,
    public palleteLength: number
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, [this.picture.buffer]);
  }
}