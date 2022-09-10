import WorkerCommand from "./WorkerCommand";

const commandName = 'end-convert';

export default class EndConvertCommand extends WorkerCommand  {
  constructor(
    public command = commandName
  ) { super(); }

  getTransfer() { return []; }
  static is(data: WorkerCommand): data is EndConvertCommand { return data.command === commandName; }
}