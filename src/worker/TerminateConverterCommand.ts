import WorkerCommand from "./WorkerCommand";

export default class TerminateConverterCommand extends WorkerCommand {
  constructor() {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this);
  }
}