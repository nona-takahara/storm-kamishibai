import IWorkerMessage from "../IWorkerMessage";
import WorkerCommand from "./WorkerCommand";

export default class ConvertSucceedCommand extends WorkerCommand {
  constructor(
    public rectangleList: IWorkerMessage
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, this.rectangleList.getTransfer());
  }
}