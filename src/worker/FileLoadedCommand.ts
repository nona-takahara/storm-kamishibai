import WorkerCommand from "./WorkerCommand";

export default class FileLoadedCommand extends WorkerCommand {
  constructor(
    public colorPallete: Uint32Array
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this);
  }
}