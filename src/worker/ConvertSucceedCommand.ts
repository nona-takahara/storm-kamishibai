import IWorkerMessage from "../IWorkerMessage";
import WorkerCommand from "./WorkerCommand";

export default class ConvertSucceedCommand extends WorkerCommand {
  constructor(
    public rectangleList: Uint32Array[]
  ) {
    super(); 
  }

  post(worker: Worker): void {
    worker.postMessage(this, this.rectangleList.map((v) => v.buffer));
  }
}