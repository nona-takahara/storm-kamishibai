import WorkerCommand from "./WorkerCommand";
import { ConvertCardInfo } from "../LuaCodeOption";

const commandName = 'convert-succeed';

export default class ConvertSucceedCommand extends WorkerCommand {
  constructor(
    public rectangleList: Uint32Array[],
    public metaData: ConvertCardInfo,
    public command = commandName
  ) { super(); }

  static from(obj: ConvertSucceedCommand) {
    return new ConvertSucceedCommand(obj.rectangleList, obj.metaData);
  }
  getTransfer() { return this.rectangleList.map((v) => v.buffer); }
  static is(data: WorkerCommand): data is ConvertSucceedCommand { return data.command === commandName; }
}