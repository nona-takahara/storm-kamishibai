import WorkerCommand from "./WorkerCommand";
import type ConvertOption from "../ConvertOption";

const commandName = 'start-convert';

export default class StartConvertCommand extends WorkerCommand  {
  constructor(
    public settings: ConvertOption,
    public colorPallete: Uint32Array,
    public colorPalleteLength: number,
    public command = commandName
  ) { super(); }

  getTransfer() { return [this.colorPallete.buffer]; }
  static is(data: WorkerCommand): data is StartConvertCommand { return data.command === commandName; }
}
