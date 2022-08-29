import IWorkerMessage from "../IWorkerMessage";
import LuaCodeOption from "../LuaCodeOption";

export default class StartConvertCommand implements IWorkerMessage  {
  constructor(
    public settings: LuaCodeOption,
    public colorPallete: Uint32Array
  ) { }

  getTransfer() { return [this.colorPallete.buffer]; }
}