import { ConvertCardInfo } from "../LuaCodeOption";
import WorkerCommand from "./WorkerCommand";

export default class ConvertResultCommand extends WorkerCommand {
  constructor(
    public rectangleList: Uint32Array[],
    public metaData: ConvertCardInfo
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, this.rectangleList.map((v) => v.buffer));
  }
}