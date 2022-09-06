import WorkerCommand from "./WorkerCommand";
import { ConvertInfo, ConvertResultInfo } from "../LuaCodeOption";
import ConvertSucceedCommand from "./ConvertSucceedCommand";

const commandName = 'convert-result';

export default class ConvertResultCommand extends WorkerCommand {
  constructor(
    public rectangleList: Uint32Array[],
    public metaData: ConvertResultInfo,
    public command = commandName
  ) { super(); }

  static from(obj: ConvertSucceedCommand, meta: ConvertResultInfo) {
    return new ConvertResultCommand(obj.rectangleList, meta);
  }
  getTransfer() { return this.rectangleList.map((v) => v.buffer); }
  static is(data: WorkerCommand): data is ConvertResultCommand { return data.command === commandName; }
}