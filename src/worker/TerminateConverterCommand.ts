import IWorkerMessage from "../IWorkerMessage";

export default class TerminateConverterCommand implements IWorkerMessage {
  getTransfer() { return []; }
}