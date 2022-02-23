import IWorkerMessage from "../IWorkerMessage";

export default class Results implements IWorkerMessage {
  constructor(public progress: number, public working: boolean, public result: undefined | IWorkerMessage) {};
  getTransfer(): Transferable[] {
    if (this.result !== undefined) {
      return this.result.getTransfer();
    } else {
      return [];
    }
  }
}