import WorkerCommand from "./WorkerCommand";

export default class EndConvertCommand extends WorkerCommand {
  constructor() {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this);
  }
}