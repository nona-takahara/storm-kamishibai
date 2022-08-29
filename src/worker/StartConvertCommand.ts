import LuaCodeOption from "../LuaCodeOption";
import WorkerCommand from "./WorkerCommand";

export default class StartConvertCommand extends WorkerCommand {
  constructor(
    public settings: LuaCodeOption,
    public colorPallete: Uint32Array
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, [this.colorPallete.buffer]);
  }
}