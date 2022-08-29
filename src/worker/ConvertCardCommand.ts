import IWorkerMessage from "../IWorkerMessage";
import { ConvertCardInfo } from "../LuaCodeOption";

export default class ConvertCardCommand implements IWorkerMessage {
  constructor(
    public picture: Uint32Array, 
    public width: number,
    public height: number,
    public palleteLength: number,
    public metaData: ConvertCardInfo
  ) { }

  getTransfer() { return [this.picture.buffer]; }
}