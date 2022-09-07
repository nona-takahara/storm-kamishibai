import WorkerCommand from "./WorkerCommand";
import { ConvertInfo, ConvertResultInfo } from "../LuaCodeOption";
import ConvertSucceedCommand from "./ConvertSucceedCommand";

const commandName = 'convert-result';

export default class ConvertResultCommand extends WorkerCommand {
  constructor(
    public luaList: string[],
    public metaData: ConvertResultInfo,
    public command = commandName
  ) { super(); }

  getTransfer() { return []; }
  static is(data: WorkerCommand): data is ConvertResultCommand { return data.command === commandName; }
}