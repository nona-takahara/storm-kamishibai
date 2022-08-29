import IWorkerMessage from "../IWorkerMessage";
import { ConvertCardInfo } from "../LuaCodeOption";

export default class ConvertResultCommand implements IWorkerMessage {
  constructor(
    public rectangleList: Uint32Array[],
    public metaData: ConvertCardInfo
  ) { }

  getTransfer() { return this.rectangleList.map((v) => v.buffer); }
}