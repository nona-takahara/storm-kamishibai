import WorkerCommand from "./WorkerCommand";
import { ConvertInfo } from "../LuaCodeOption";

const commandName = 'convert-card';

export default class ConvertCardCommand extends WorkerCommand {
  constructor(
    public picture: Uint32Array, 
    public width: number,
    public height: number,
    public palleteLength: number,
    public metaData: ConvertInfo,
    public command = commandName
  ) { super(); }

  static from(obj: ConvertCardCommand) {
    return new ConvertCardCommand(obj.picture, obj.width, obj.height, obj.palleteLength, obj.metaData);
  }
  getTransfer() { return [this.picture.buffer]; }
  static is(data: WorkerCommand): data is ConvertCardCommand { return data.command === commandName; }
}