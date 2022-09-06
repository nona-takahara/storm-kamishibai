import WorkerCommand from "./WorkerCommand";
import { ConvertCardInfo } from "../LuaCodeOption";
import ConvertSucceedCommand from "./ConvertSucceedCommand";

const commandName = 'convert-result';

export default class ConvertResultCommand extends WorkerCommand {
  constructor(
    public rectangleList: Uint32Array[],
    public metaData: ConvertCardInfo,
    public command = commandName
  ) { super(); }

  static from(obj: ConvertSucceedCommand) {
    return new ConvertResultCommand(obj.rectangleList, obj.metaData);
  }
  getTransfer() { return this.rectangleList.map((v) => v.buffer); }
  static is(data: WorkerCommand): data is ConvertResultCommand { return data.command === commandName; }
}