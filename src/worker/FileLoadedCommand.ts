import WorkerCommand from "./WorkerCommand";

const commandName = 'file-loaded';

export default class FileLoadedCommand extends WorkerCommand {
  constructor(
    public colorPallete: Uint32Array,
    public command = commandName
  ) { super(); }

  getTransfer() { return []; }
  static is(data: WorkerCommand): data is FileLoadedCommand { return data.command === commandName; }
}