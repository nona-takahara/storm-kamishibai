import WorkerCommand from "./WorkerCommand";

const commandName = 'terminate-convert';

export default class TerminateConverterCommand extends WorkerCommand {
  constructor(public command = commandName) { super(); }
  getTransfer() { return []; }
  static is(data: WorkerCommand): data is TerminateConverterCommand { return data.command === commandName; }
}