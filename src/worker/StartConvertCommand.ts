import WorkerCommand from "./WorkerCommand";
import LuaCodeOption from "../LuaCodeOption";

const commandName = 'start-convert';

export default class StartConvertCommand extends WorkerCommand  {
  constructor(
    public settings: LuaCodeOption,
    public colorPallete: Uint32Array,
    public command = commandName
  ) { super(); }

  getTransfer() { return [this.colorPallete.buffer]; }
  static is(data: WorkerCommand): data is StartConvertCommand { return data.command === commandName; }
}