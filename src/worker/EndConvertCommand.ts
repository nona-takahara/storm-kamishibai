import IWorkerMessage from "../IWorkerMessage";

export default class EndConvertCommand implements IWorkerMessage {
  getTransfer() { return []; } 
}