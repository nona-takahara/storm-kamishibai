import WorkerCommand from "./WorkerCommand";
import { ConvertCardInfo } from "../LuaCodeOption";

const commandName = 'convert-card';

export default class ConvertCardCommand extends WorkerCommand {
  constructor(
    public picture: Uint32Array, 
    public width: number,
    public height: number,
    public palleteLength: number,
    public metaData: ConvertCardInfo,
    public command = commandName
  ) { super(); }

  getTransfer() { return [this.picture.buffer]; }
  static is(data: WorkerCommand): data is ConvertCardCommand { return data.command === commandName; }
}